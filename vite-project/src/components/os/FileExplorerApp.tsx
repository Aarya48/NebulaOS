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
    const name = prompt('Enter folder name:');
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
      else alert(data.message);
    } catch (err) {
      alert('Failed to create folder');
    }
  };

  const handleCreateFile = async () => {
    const name = prompt('Enter file name (e.g. document.txt):');
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
      else alert(data.message);
    } catch (err) {
      alert('Failed to create file');
    }
  };

  const handleDelete = async (id: string) => {
    const item = files.find(f => f._id === id);
    if (item?.name === 'Desktop' && item?.parentFolder === null) {
      alert("Cannot delete the system Desktop folder.");
      return;
    }
    if (!confirm('Are you sure you want to delete this item?')) return;
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
      else alert(data.message);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleRename = async (id: string, currentName: string) => {
    const item = files.find(f => f._id === id);
    if (item?.name === 'Desktop' && item?.parentFolder === null) {
      alert("Cannot rename the system Desktop folder.");
      return;
    }

    const name = prompt('Enter new name:', currentName);
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
      else alert(data.message);
    } catch (err) {
      alert('Failed to rename item');
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

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item._id, item.name);
    } else {
      // For now, just alert or we can build a text editor later
      alert(`Opening file: ${item.name}\n\nContent:\n${item.content || '(Empty)'}`);
      
      // Mark as opened
      const token = localStorage.getItem('nebula_token');
      fetch(`http://localhost:5000/api/files/open/${item._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
                {files.map((file) => (
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
                        <FileText className="w-12 h-12 text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                      )}
                      {file.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-400 absolute -bottom-1 -right-1 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" fill="currentColor" />
                      )}
                    </div>
                    <span className="text-center truncate w-full text-gray-300 group-hover:text-white transition-colors">{file.name}</span>
                  </motion.div>
                ))}
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
                <Trash2 className="w-4 h-4" /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
