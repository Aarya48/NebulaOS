import { useState, useEffect, useCallback } from 'react';
import type { FileItem } from './FileExplorerApp';
import { Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function DesktopIcons({ onOpenFolder }: { onOpenFolder: (folderId: string) => void }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [debugMsg, setDebugMsg] = useState('Init...');

  const fetchDesktopFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem('nebula_token');
      // 1. Fetch root files
      const rootRes = await fetch('http://localhost:5000/api/files/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rootData = await rootRes.json();
      
      if (rootData.success) {
        const desktopFolder = rootData.files.find((f: FileItem) => f.name === 'Desktop' && f.type === 'folder' && f.parentFolder === null);
        
        if (desktopFolder) {
          setDebugMsg(`Found Desktop: ${desktopFolder._id}`);
          // Fetch contents of desktop folder
          const contentRes = await fetch(`http://localhost:5000/api/files/folder/${desktopFolder._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const contentData = await contentRes.json();
          if (contentData.success) {
            setFiles(contentData.files || []);
            setDebugMsg(`Loaded ${contentData.files?.length || 0} files`);
          } else {
            setDebugMsg('Failed to load contents');
          }
        } else {
          setDebugMsg('No desktop folder found');
          setFiles([]);
        }
      } else {
        setDebugMsg('Root fetch failed');
      }
    } catch (err: any) {
      setDebugMsg(`Error: ${err.message}`);
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
      alert(`Opening file from desktop: ${item.name}\n\nContent:\n${item.content || '(Empty)'}`);
      const token = localStorage.getItem('nebula_token');
      fetch(`http://localhost:5000/api/files/open/${item._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  };

  return (
    <div className="absolute inset-0 z-0 p-6 pt-20 pointer-events-none">
      <div className="flex flex-col gap-4 w-24">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              key={file._id}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-colors w-24 cursor-pointer group pointer-events-auto"
              onDoubleClick={() => handleDoubleClick(file)}
            >
              <div className="relative mb-2">
                {file.type === 'folder' ? (
                  <Folder className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" fill="currentColor" fillOpacity={0.4} />
                ) : (
                  <FileText className="w-12 h-12 text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                )}
              </div>
              <span className="text-center truncate w-full text-white text-xs drop-shadow-md bg-black/30 rounded px-1 group-hover:bg-cyan-500/30 transition-colors">
                {file.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
