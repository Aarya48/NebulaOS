import { useState, useEffect, useCallback, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { 
  Folder, 
  Save, 
  RefreshCw,
  Code2,
  FileCode2,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIconData } from '@/lib/fileIcons';
import type { FileItem } from './FileExplorerApp';

export function CodeEditorApp() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const monaco = useMonaco();

  const fetchFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch('http://localhost:5000/api/files/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to fetch files for editor', err);
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

  // Listen for the custom "open editor" event with a file ID
  useEffect(() => {
    const handleOpenEditor = (e: any) => {
      const targetId = e.detail?.id;
      if (targetId) {
        const fileToOpen = files.find(f => f._id === targetId);
        if (fileToOpen) {
          setCurrentFile(fileToOpen);
          setEditorContent(fileToOpen.content || '');
        }
      }
    };
    window.addEventListener('nebula_open_editor', handleOpenEditor);
    return () => window.removeEventListener('nebula_open_editor', handleOpenEditor);
  }, [files]);

  // When files update, if we have an open file, update its content IF we haven't modified it locally
  // For simplicity, we just keep the local editor content unless explicitly reopened
  // But if the open file is deleted, clear it.
  useEffect(() => {
    if (currentFile && !files.find(f => f._id === currentFile._id)) {
      setCurrentFile(null);
      setEditorContent('');
    }
  }, [files, currentFile]);

  const handleSave = async () => {
    if (!currentFile) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/content/${currentFile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editorContent })
      });
      const data = await response.json();
      if (data.success) {
        // Trigger global FS update
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
    } catch (err) {
      console.error('Failed to save file', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Setup Monaco theme
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('nebula-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#05010A',
          'editor.lineHighlightBackground': '#ffffff0a',
        }
      });
      monaco.editor.setTheme('nebula-dark');
    }
  }, [monaco]);

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'py': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'cpp': case 'c': case 'h': return 'cpp';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  return (
    <div className="w-full h-full flex bg-[#05010A] text-white font-sans text-sm relative">
      
      {/* Sidebar */}
      <div 
        className={cn(
          "h-full border-r border-white/10 flex flex-col bg-[#0a0514] transition-all duration-300 shrink-0",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className="h-10 border-b border-white/10 flex items-center px-4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest bg-black/20">
          Explorer
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...
            </div>
          ) : (
            files.filter(f => f.type === 'file').map(file => {
              const { icon: Icon, colorClass } = getFileIconData(file.name);
              const isActive = currentFile?._id === file._id;
              
              return (
                <button
                  key={file._id}
                  onClick={() => {
                    setCurrentFile(file);
                    setEditorContent(file.content || '');
                  }}
                  className={cn(
                    "w-full flex items-center px-4 py-1.5 text-left transition-colors text-sm group",
                    isActive ? "bg-cyan-500/10 text-white" : "hover:bg-white/5 text-gray-400"
                  )}
                >
                  <Icon className={cn("w-4 h-4 mr-2 shrink-0", isActive ? colorClass : "text-gray-500 group-hover:text-gray-300")} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#120a1c] shrink-0">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {currentFile && (
              <div className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">Editing:</span>
                <span className="font-mono text-cyan-300">{currentFile.name}</span>
                {editorContent !== (currentFile.content || '') && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes"></span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSave}
              disabled={!currentFile || isSaving}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors",
                !currentFile ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                : isSaving ? "bg-cyan-900 text-cyan-500" 
                : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
              )}
            >
              {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Editor Instance */}
        <div className="flex-1 relative bg-[#05010A]">
          {!currentFile ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 select-none">
              <Code2 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Nebula Code Editor</p>
              <p className="text-sm mt-2">Select a file from the explorer to start editing</p>
            </div>
          ) : (
            <Editor
              height="100%"
              language={getLanguage(currentFile.name)}
              theme="nebula-dark"
              value={editorContent}
              onChange={(value) => setEditorContent(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
