import { useState, useEffect, useCallback } from 'react';
import { 
  Folder, 
  FileText, 
  Eclipse,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import type { FileItem } from './FileExplorerApp';

export function TrashApp() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);

  // Dialog State
  type DialogConfig = {
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };
  const [dialog, setDialog] = useState<DialogConfig>({ isOpen: false, type: 'alert', title: '', message: '' });

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
      const response = await fetch('http://localhost:5000/api/files/trash', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFiles(data.files || []);
      } else {
        setError(data.message || 'Failed to fetch files');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    const handleUpdate = () => fetchFiles();
    window.addEventListener('nebula_fs_update', handleUpdate);
    return () => window.removeEventListener('nebula_fs_update', handleUpdate);
  }, [fetchFiles]);

  // Click outside to close context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRestore = async (id: string) => {
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/restore/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      } else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to restore item');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!(await showConfirm('Obliterate Item', 'Are you sure you want to PERMANENTLY delete this item? It cannot be recovered.'))) return;
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/permanent/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchFiles();
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      } else await showAlert('Error', data.message);
    } catch (err) {
      await showAlert('Error', 'Failed to permanently delete item');
    }
  };

  const handleEmptyTrash = async () => {
    if (files.length === 0) return;
    if (!(await showConfirm('Empty Blackhole', 'Are you sure you want to permanently delete ALL items in the Blackhole? This action is irreversible.'))) return;
    try {
      const token = localStorage.getItem('nebula_token');
      for (const file of files) {
        await fetch(`http://localhost:5000/api/files/permanent/${file._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchFiles();
      window.dispatchEvent(new CustomEvent('nebula_fs_update'));
    } catch (err) {
      await showAlert('Error', 'Error occurred while emptying blackhole');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f0505]/95 text-white font-sans text-sm relative" onClick={() => setContextMenu(null)}>
      {/* Topbar */}
      <div className="h-14 border-b border-red-500/20 flex items-center justify-between px-6 bg-red-950/10 shrink-0">
        <div className="flex items-center space-x-2 text-red-400 font-medium tracking-widest uppercase">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Blackhole
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={fetchFiles} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white" title="Refresh">
            <RefreshCw className={cn("w-4 h-4", isLoading ? "animate-spin" : "")} />
          </button>
          
          {files.length > 0 && (
            <>
              <div className="w-px h-4 bg-white/10 mx-2"></div>
              <button onClick={handleEmptyTrash} className="p-2 hover:bg-red-500/20 text-red-400 rounded-md transition-colors flex items-center space-x-2 border border-red-500/30" title="Empty Blackhole">
                <Eclipse className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">Empty Blackhole</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Scanning Void...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-400">{error}</div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
            <div className="w-24 h-24 rounded-full bg-red-950/20 flex items-center justify-center">
               <Eclipse className="w-10 h-10 text-red-500/40" />
            </div>
            <div className="text-lg">The void is empty.</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={file._id}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-red-500/10 transition-colors w-full cursor-pointer group relative border border-transparent hover:border-red-500/20"
                  onContextMenu={(e) => handleContextMenu(e, file._id)}
                >
                  <div className="relative mb-3">
                    {file.type === 'folder' ? (
                      <Folder className="w-12 h-12 text-red-400/70 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]" fill="currentColor" fillOpacity={0.1} />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                    )}
                  </div>
                  <span className="text-center truncate w-full text-gray-400 group-hover:text-red-300 transition-colors">{file.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Context Menu overlay */}
        {contextMenu && (
          <div 
            className="fixed bg-[#1a0505] border border-red-500/30 rounded-xl shadow-2xl py-2 z-50 min-w-[160px] backdrop-blur-xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="w-full text-left px-4 py-2 hover:bg-green-500/20 flex items-center space-x-2 text-green-400 transition-colors"
              onClick={() => { handleRestore(contextMenu.id); setContextMenu(null); }}
            >
              <RefreshCw className="w-4 h-4" /> <span>Restore</span>
            </button>
            <div className="h-px bg-red-500/20 my-1"></div>
            <button 
              className="w-full text-left px-4 py-2 hover:bg-red-500/20 flex items-center space-x-2 text-red-500 transition-colors font-bold"
              onClick={() => { handlePermanentDelete(contextMenu.id); setContextMenu(null); }}
            >
              <Eclipse className="w-4 h-4" /> <span>Obliterate</span>
            </button>
          </div>
        )}
      </div>

      {/* Dialog Modal overlay */}
      <AnimatePresence>
        {dialog.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="bg-[#1a0505] border border-red-500/40 rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-3 text-red-500">
                 <AlertTriangle className="w-6 h-6" />
                 <h2 className="text-lg font-bold">{dialog.title}</h2>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{dialog.message}</p>
              
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
                  onClick={() => dialog.onConfirm?.()}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/50 rounded-md transition-colors font-bold tracking-wider uppercase"
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
