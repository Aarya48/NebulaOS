import { useState, useEffect, useCallback } from 'react';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  Home, 
  Star, 
  Clock,
  Plus,
  MoreVertical,
  RefreshCw,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIconData } from '@/lib/fileIcons';
import { motion, AnimatePresence } from 'motion/react';

export interface FileItem {
  _id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentFolder: string | null;
  isFavorite?: boolean;
  lastOpened?: string;
  createdAt: string;
  updatedAt: string;
}

export function FileExplorerApp() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null, name: string}[]>([
    { id: null, name: 'Home' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sidebar navigation state
  const [currentView, setCurrentView] = useState<'files' | 'favorites' | 'recent' | 'desktop'>('files');

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);

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

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('nebula_token');
      let url = 'http://localhost:5000/api/files/';
      
      if (currentView === 'favorites') {
        url = 'http://localhost:5000/api/files/favorite';
      } else if (currentView === 'recent') {
        url = 'http://localhost:5000/api/files/recent';
      } else if (currentFolder) {
        url = `http://localhost:5000/api/files/folder/${currentFolder}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setFiles(data.files || []);
      } else {
        setError(data.message || 'Failed to load files');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, currentView]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const handleUpdate = () => fetchFiles();
    window.addEventListener('nebula_fs_update', handleUpdate);
    return () => window.removeEventListener('nebula_fs_update', handleUpdate);
  }, [fetchFiles]);

  useEffect(() => {
    const handleOpen = (e: any) => navigateToFolder(e.detail.id, e.detail.name);
    window.addEventListener('nebula_fs_open', handleOpen as any);
    return () => window.removeEventListener('nebula_fs_open', handleOpen as any);
  }, []);

  // Click outside to close context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreateFolder = async () => {
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
        body: JSON.stringify({ name, parentFolder: currentFolder })
      });
      const data = await response.json();
      if (data.success) {
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to create folder');
    }
  };

  const handleCreateFile = async () => {
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
        body: JSON.stringify({ name, content: '', parentFolder: currentFolder })
      });
      const data = await response.json();
      if (data.success) {
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to create file');
    }
  };

  const handleDelete = async (id: string) => {
    const item = files.find(f => f._id === id);
    if (item?.name === 'Desktop' && item?.parentFolder === null) {
      await showAlert('Access Denied', "Cannot delete the system Desktop folder.");
      return;
    }
    if (!(await showConfirm('Delete Item', 'Are you sure you want to move this item to the trash?'))) return;
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
      else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to delete item');
    }
  };

  const handleRename = async (id: string, currentName: string) => {
    const item = files.find(f => f._id === id);
    if (item?.name === 'Desktop' && item?.parentFolder === null) {
      await showAlert('Access Denied', "Cannot rename the system Desktop folder.");
      return;
    }

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
        fetchFiles();
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
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToFolder = (id: string | null, name: string) => {
    setCurrentView('files');
    setCurrentFolder(id);
    
    // Update breadcrumbs
    if (id === null) {
      setBreadcrumbs([{ id: null, name: 'Home' }]);
    } else {
      const index = breadcrumbs.findIndex(b => b.id === id);
      if (index !== -1) {
         setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      } else {
         setBreadcrumbs(prev => [...prev, { id, name }]);
      }
    }
  };

  const navigateToDesktop = async () => {
    setIsLoading(true);
    setCurrentView('desktop');
    try {
      const token = localStorage.getItem('nebula_token');
      // 1. Fetch root files
      const rootRes = await fetch('http://localhost:5000/api/files/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rootData = await rootRes.json();
      
      if (rootData.success) {
        let desktopFolder = rootData.files.find((f: FileItem) => f.name === 'Desktop' && f.type === 'folder' && f.parentFolder === null);
        
        // 2. Create if not exists
        if (!desktopFolder) {
          const createRes = await fetch('http://localhost:5000/api/files/folder/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: 'Desktop', parentFolder: null })
          });
          const createData = await createRes.json();
          if (createData.success) {
            desktopFolder = createData.folder;
          }
        }
        
        // 3. Navigate to it
        if (desktopFolder) {
          setCurrentFolder(desktopFolder._id);
          setBreadcrumbs([{ id: null, name: 'Home' }, { id: desktopFolder._id, name: 'Desktop' }]);
        }
      }
    } catch (err) {
      setError('Failed to load Desktop');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemDoubleClick = async (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item._id, item.name);
    } else {
      window.dispatchEvent(new CustomEvent('nebula_open_editor_intent', { detail: { id: item._id } }));
      
      // Mark as opened
      const token = localStorage.getItem('nebula_token');
      try {
        await fetch(`http://localhost:5000/api/files/open/${item._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchFiles();
      } catch (e) {}
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="w-full h-full flex bg-[#05010A]/80 text-white font-sans text-sm" onClick={() => setContextMenu(null)}>
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 flex flex-col space-y-2 shrink-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-2">Locations</div>
        
        <button 
          onClick={() => { setCurrentView('files'); navigateToFolder(null, 'Home'); }}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", currentView === 'files' ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/5 text-gray-300")}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button 
          onClick={navigateToDesktop}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", currentView === 'desktop' ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-white/5 text-gray-300")}
        >
          <Monitor className="w-4 h-4" />
          <span>Desktop</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('favorites')}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", currentView === 'favorites' ? "bg-fuchsia-500/20 text-fuchsia-400" : "hover:bg-white/5 text-gray-300")}
        >
          <Star className="w-4 h-4" />
          <span>Favorites</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('recent')}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", currentView === 'recent' ? "bg-green-500/20 text-green-400" : "hover:bg-white/5 text-gray-300")}
        >
          <Clock className="w-4 h-4" />
          <span>Recent</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar / Breadcrumbs */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 shrink-0">
          <div className="flex items-center space-x-2 text-gray-300 overflow-hidden">
            {currentView === 'files' || currentView === 'desktop' ? (
              breadcrumbs.map((crumb, index) => (
                <div key={crumb.id || 'root'} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-600 shrink-0" />}
                  <button 
                    onClick={() => navigateToFolder(crumb.id, crumb.name)}
                    className={cn(
                      "hover:text-cyan-400 transition-colors truncate max-w-[120px]",
                      index === breadcrumbs.length - 1 ? "text-white font-medium" : ""
                    )}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-white font-medium capitalize">{currentView} Files</div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={fetchFiles} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white" title="Refresh">
              <RefreshCw className={cn("w-4 h-4", isLoading ? "animate-spin" : "")} />
            </button>
            
            {(currentView === 'files' || currentView === 'desktop') && (
              <>
                <div className="w-px h-4 bg-white/10 mx-2"></div>
                <button onClick={handleCreateFolder} className="p-2 hover:bg-cyan-500/20 text-cyan-400 rounded-md transition-colors flex items-center" title="New Folder">
                  <FolderPlus className="w-4 h-4" />
                </button>
                <button onClick={handleCreateFile} className="p-2 hover:bg-cyan-500/20 text-cyan-400 rounded-md transition-colors flex items-center" title="New File">
                  <FilePlus className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {isLoading && files.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-400">{error}</div>
          ) : files.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col space-y-4">
              <Folder className="w-16 h-16 opacity-20" />
              <p>This folder is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 place-items-start">
              <AnimatePresence>
                {files.map((file) => {
                  const { icon: FileIcon, colorClass, glowClass } = getFileIconData(file.name);
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={file._id}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-colors w-full cursor-pointer group relative"
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      onContextMenu={(e) => handleContextMenu(e, file._id)}
                    >
                      <div className="relative mb-3">
                        {file.type === 'folder' ? (
                          <Folder className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" fill="currentColor" fillOpacity={0.2} />
                        ) : (
                          <FileIcon className={cn("w-12 h-12 transition-all", colorClass, glowClass)} />
                        )}
                        {file.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-400 absolute -bottom-1 -right-1 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" fill="currentColor" />
                        )}
                      </div>
                      <span className="text-center truncate w-full text-gray-300 group-hover:text-white transition-colors">{file.name}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Context Menu overlay */}
          {contextMenu && (
            <div 
              className="fixed bg-[#120a1c] border border-white/10 rounded-xl shadow-2xl py-2 z-50 min-w-[160px] backdrop-blur-xl"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => { handleRename(contextMenu.id, files.find(f => f._id === contextMenu.id)?.name || ''); setContextMenu(null); }}
              >
                <Edit2 className="w-4 h-4" /> <span>Rename</span>
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => { handleToggleFavorite(contextMenu.id); setContextMenu(null); }}
              >
                <Star className="w-4 h-4" /> <span>Toggle Favorite</span>
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-red-500/20 flex items-center space-x-2 text-red-400"
                onClick={() => { handleDelete(contextMenu.id); setContextMenu(null); }}
              >
                <Trash2 className="w-4 h-4" /> <span>Move to Trash</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Modal overlay */}
      <AnimatePresence>
        {dialog.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
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
                  className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white outline-none focus:border-cyan-500 transition-colors"
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
                  className="px-4 py-2 text-sm bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-md transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
