import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { FileItem } from './FileExplorerApp';
import { cn } from '@/lib/utils';
import { getFileIconData } from '@/lib/fileIcons';
import { 
  Folder, 
  Trash2, 
  FolderPlus, 
  FilePlus, 
  RefreshCw, 
  Edit2, 
  Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '@/lib/SettingsContext';

export function DesktopIcons({ onOpenFolder }: { onOpenFolder: (folderId: string) => void }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [desktopFolderId, setDesktopFolderId] = useState<string | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ type: 'item' | 'empty', id?: string, x: number, y: number } | null>(null);

  const { preferences } = useSettings();
  const iconSizeClass = preferences.desktopIconSize === 'small' ? 'w-8 h-8' : preferences.desktopIconSize === 'large' ? 'w-16 h-16' : 'w-12 h-12';
  const containerSizeClass = preferences.desktopIconSize === 'small' ? 'w-20' : preferences.desktopIconSize === 'large' ? 'w-32' : 'w-24';

  // Dialog State
  type DialogConfig = {
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'prompt';
    title: string;
    message: string;
    defaultValue?: string;
    onConfirm?: (value?: string) => void;
    onCancel?: () => void;
  };
  const [dialog, setDialog] = useState<DialogConfig>({ isOpen: false, type: 'alert', title: '', message: '' });
  const [promptValue, setPromptValue] = useState('');

  const showPrompt = (title: string, message: string, defaultValue = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptValue(defaultValue);
      setDialog({
        isOpen: true, type: 'prompt', title, message, defaultValue,
        onConfirm: (val) => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(val || null); },
        onCancel: () => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(null); }
      });
    });
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true, type: 'confirm', title, message,
        onConfirm: () => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(true); },
        onCancel: () => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(false); }
      });
    });
  };

  const showAlert = (title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true, type: 'alert', title, message,
        onConfirm: () => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(); },
        onCancel: () => { setDialog(prev => ({ ...prev, isOpen: false })); resolve(); }
      });
    });
  };

  const fetchDesktopFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem('nebula_token');
      const rootRes = await fetch('http://localhost:5000/api/files/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rootData = await rootRes.json();
      
      if (rootData.success) {
        const desktopFolder = rootData.files.find((f: FileItem) => f.name === 'Desktop' && f.type === 'folder' && f.parentFolder === null);
        
        if (desktopFolder) {
          setDesktopFolderId(desktopFolder._id);
          const contentRes = await fetch(`http://localhost:5000/api/files/folder/${desktopFolder._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const contentData = await contentRes.json();
          if (contentData.success) {
            setFiles(contentData.files || []);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load desktop files', err);
    }
  }, []);

  useEffect(() => {
    fetchDesktopFiles();
  }, [fetchDesktopFiles]);

  useEffect(() => {
    const handleUpdate = () => fetchDesktopFiles();
    window.addEventListener('nebula_fs_update', handleUpdate);
    return () => window.removeEventListener('nebula_fs_update', handleUpdate);
  }, [fetchDesktopFiles]);

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      onOpenFolder(item._id);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('nebula_fs_open', { detail: { id: item._id, name: item.name } }));
      }, 100);
    } else {
      window.dispatchEvent(new CustomEvent('nebula_open_editor_intent', { detail: { id: item._id } }));
    }
  };

  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
    }
    setContextMenu({ type: 'item', id, x: e.clientX, y: e.clientY });
  };

  const handleEmptyContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIds([]);
    setContextMenu({ type: 'empty', x: e.clientX, y: e.clientY });
  };

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setContextMenu(null);
    if (e.ctrlKey || e.metaKey) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  // API Actions
  const handleCreateFolder = async () => {
    if (!desktopFolderId) return;
    const name = await showPrompt('New Folder', 'Enter folder name:');
    if (!name) return;

    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch('http://localhost:5000/api/files/folder/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, parentFolder: desktopFolderId })
      });
      const data = await response.json();
      if (data.success) {
        fetchDesktopFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to create folder');
    }
  };

  const handleCreateFile = async () => {
    if (!desktopFolderId) return;
    const name = await showPrompt('New File', 'Enter file name (e.g. document.txt):');
    if (!name) return;

    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch('http://localhost:5000/api/files/file/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, content: '', parentFolder: desktopFolderId })
      });
      const data = await response.json();
      if (data.success) {
        fetchDesktopFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to create file');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!(await showConfirm('Delete Items', `Are you sure you want to move ${selectedIds.length} item(s) to the trash?`))) return;
    
    try {
      const token = localStorage.getItem('nebula_token');
      await Promise.all(selectedIds.map(id => 
        fetch(`http://localhost:5000/api/files/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
      
      setSelectedIds([]);
      fetchDesktopFiles();
      window.dispatchEvent(new CustomEvent('nebula_fs_update'));
    } catch (err) {
      await showAlert('Error', 'Failed to delete items');
    }
  };

  const handleRename = async (id: string, currentName: string) => {
    const name = await showPrompt('Rename', 'Enter new name:', currentName);
    if (!name || name === currentName) return;

    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.success) {
        fetchDesktopFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to rename item');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/favorite/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchDesktopFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div 
        className="absolute inset-0 z-0 p-6 pt-20 pointer-events-auto"
        onClick={() => { setContextMenu(null); setSelectedIds([]); }}
        onContextMenu={handleEmptyContextMenu}
      >
        <div className="flex flex-col flex-wrap gap-4 h-full content-start items-start">
          <AnimatePresence>
            {files.map((file) => {
              const { icon: FileIcon, colorClass, glowClass } = getFileIconData(file.name);
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={file._id}
                  className={cn(
                    `flex flex-col items-center p-2 rounded-xl transition-colors cursor-pointer group pointer-events-auto ${containerSizeClass}`,
                    selectedIds.includes(file._id) ? "bg-os-main/20 ring-1 ring-os-main/50" : "hover:bg-white/10"
                  )}
                  onClick={(e) => handleItemClick(e, file._id)}
                  onDoubleClick={() => handleDoubleClick(file)}
                  onContextMenu={(e) => handleItemContextMenu(e, file._id)}
                >
                  <div className="relative mb-2 pointer-events-none">
                    {file.type === 'folder' ? (
                      <Folder className={cn(iconSizeClass, "text-os-main drop-shadow-[0_0_10px_rgba(var(--os-main),0.5)]")} fill="currentColor" fillOpacity={0.2} />
                    ) : (
                      <FileIcon className={cn("transition-all", iconSizeClass, colorClass, glowClass)} />
                    )}
                    {file.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-400 absolute -bottom-1 -right-1 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" fill="currentColor" />
                    )}
                  </div>
                  <span className={cn(
                    "text-center text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 rounded-sm truncate w-full pointer-events-none",
                    selectedIds.includes(file._id) ? "bg-os-main/30" : "group-hover:bg-os-main/30"
                  )}>
                    {file.name}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Context Menu overlay via Portal */}
      {contextMenu && createPortal(
        <div 
          className="fixed bg-[#120a1c] border border-white/10 rounded-xl shadow-2xl py-2 z-[99999] min-w-[160px] backdrop-blur-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {contextMenu.type === 'item' ? (
            <>
              {selectedIds.length === 1 && (
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                  onClick={() => { handleRename(selectedIds[0], files.find(f => f._id === selectedIds[0])?.name || ''); setContextMenu(null); }}
                >
                  <Edit2 className="w-4 h-4" /> <span>Rename</span>
                </button>
              )}
              {selectedIds.length === 1 && (
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                  onClick={() => { handleToggleFavorite(selectedIds[0]); setContextMenu(null); }}
                >
                  <Star className="w-4 h-4" /> <span>Toggle Favorite</span>
                </button>
              )}
              {selectedIds.length > 0 && (
                <>
                  <div className="h-px bg-white/10 my-1"></div>
                  <button 
                    className="w-full text-left px-4 py-2 hover:bg-red-500/20 flex items-center space-x-2 text-red-400"
                    onClick={() => { handleDeleteSelected(); setContextMenu(null); }}
                  >
                    <Trash2 className="w-4 h-4" /> <span>Delete Selected ({selectedIds.length})</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => { handleCreateFolder(); setContextMenu(null); }}
              >
                <FolderPlus className="w-4 h-4" /> <span>New Folder</span>
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => { handleCreateFile(); setContextMenu(null); }}
              >
                <FilePlus className="w-4 h-4" /> <span>New File</span>
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => { fetchDesktopFiles(); setContextMenu(null); }}
              >
                <RefreshCw className="w-4 h-4" /> <span>Refresh</span>
              </button>
            </>
          )}
        </div>,
        document.body
      )}

      {/* Dialog Modal overlay via Portal */}
      {dialog.isOpen && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#120a1c] border border-white/20 rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col space-y-4"
          >
            <h2 className="text-lg font-bold text-white">{dialog.title}</h2>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{dialog.message}</p>
            
            {dialog.type === 'prompt' && (
              <input 
                type="text" 
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white outline-none focus:border-os-main transition-colors"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && dialog.onConfirm?.(promptValue)}
              />
            )}

            <div className="flex justify-end space-x-3 pt-2">
              {dialog.type !== 'alert' && (
                <button 
                  onClick={dialog.onCancel}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                onClick={() => dialog.onConfirm?.(dialog.type === 'prompt' ? promptValue : undefined)}
                className="px-4 py-2 text-sm bg-os-main/20 text-os-main hover:bg-os-main/30 rounded-md transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}
