import { useState, useEffect, useCallback, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { 
  Folder, 
  Save, 
  RefreshCw,
  Code2,
  Menu,
  ChevronRight,
  ChevronDown,
  X,
  FolderOpen,
  ArrowLeft,
  Play,
  Terminal as TerminalIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFileIconData } from '@/lib/fileIcons';
import type { FileItem } from './FileExplorerApp';

const FileTreeNode = ({ 
  item, 
  depth, 
  files, 
  expandedFolders, 
  toggleFolder, 
  openFile, 
  activeFileId,
  editorContents
}: any) => {
  if (item.type === 'folder') {
    const children = files
      .filter((f: FileItem) => f.parentFolder === item._id)
      .sort((a: FileItem, b: FileItem) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1) || a.name.localeCompare(b.name));
    
    const isExpanded = expandedFolders.has(item._id);
    
    return (
      <div>
        <button 
          onClick={() => toggleFolder(item._id)}
          className="w-full flex items-center py-1 hover:bg-white/5 text-gray-300 text-xs transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isExpanded ? <ChevronDown className="w-3 h-3 mr-1 opacity-70" /> : <ChevronRight className="w-3 h-3 mr-1 opacity-70" />}
          <Folder className="w-3 h-3 mr-1.5 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" fill="currentColor" fillOpacity={0.2} />
          <span className="truncate">{item.name}</span>
        </button>
        {isExpanded && children.map((child: FileItem) => (
          <FileTreeNode 
            key={child._id} 
            item={child} 
            depth={depth + 1} 
            files={files} 
            expandedFolders={expandedFolders} 
            toggleFolder={toggleFolder} 
            openFile={openFile} 
            activeFileId={activeFileId} 
            editorContents={editorContents} 
          />
        ))}
      </div>
    )
  }

  // File
  const { icon: Icon, colorClass } = getFileIconData(item.name);
  const isActive = activeFileId === item._id;
  const isUnsaved = editorContents[item._id] !== undefined && editorContents[item._id] !== (item.content || '');
  
  return (
    <button
      onClick={() => openFile(item)}
      className={cn(
        "w-full flex items-center py-1 text-xs group transition-colors",
        isActive ? "bg-cyan-500/10 text-white border-r-2 border-cyan-500" : "hover:bg-white/5 text-gray-400 border-r-2 border-transparent"
      )}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <Icon className={cn("w-3 h-3 mr-1.5 shrink-0 transition-colors", isActive ? colorClass : "text-gray-500 group-hover:text-gray-300")} />
      <span className="truncate">{item.name}</span>
      {isUnsaved && <span className="ml-auto mr-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" title="Unsaved changes" />}
    </button>
  );
};

export function CodeEditorApp() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tabs State
  const [openFiles, setOpenFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editorContents, setEditorContents] = useState<Record<string, string>>({});
  
  // Tree State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [rootFolderId, setRootFolderId] = useState<string | null>(null);
  const [isSelectingRoot, setIsSelectingRoot] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<{ stdout: string; stderr: string; executionTime: number } | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [stdinInput, setStdinInput] = useState('');

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

  // Sync open files with backend data (in case a file is deleted or renamed externally)
  useEffect(() => {
    setOpenFiles(prev => prev.map(openFile => {
      const updated = files.find(f => f._id === openFile._id);
      return updated ? updated : openFile;
    }).filter(f => files.some(backendFile => backendFile._id === f._id))); // Remove if deleted
    
    if (activeFileId && !files.find(f => f._id === activeFileId)) {
      setActiveFileId(null);
    }
  }, [files]);

  // Setup Monaco theme
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('nebula-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#120a1c',
          'editor.lineHighlightBackground': '#ffffff0a',
          'editor.selectionBackground': '#06b6d440',
        }
      });
      monaco.editor.setTheme('nebula-dark');
    }
  }, [monaco]);

  const openFile = (file: FileItem) => {
    if (!openFiles.find(f => f._id === file._id)) {
      setOpenFiles(prev => [...prev, file]);
      if (editorContents[file._id] === undefined) {
        setEditorContents(prev => ({ ...prev, [file._id]: file.content || '' }));
      }
    }
    setActiveFileId(file._id);
  };

  const closeFile = (id: string) => {
    setOpenFiles(prev => {
      const newFiles = prev.filter(f => f._id !== id);
      if (activeFileId === id) {
        if (newFiles.length > 0) {
          setActiveFileId(newFiles[newFiles.length - 1]._id);
        } else {
          setActiveFileId(null);
        }
      }
      return newFiles;
    });
    
    setEditorContents(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Listen for the custom "open editor" event
  useEffect(() => {
    const handleOpenEditor = (e: any) => {
      const targetId = e.detail?.id;
      if (targetId) {
        const fileToOpen = files.find(f => f._id === targetId);
        if (fileToOpen) {
          openFile(fileToOpen);
          
          // Auto-expand folders to reach this file
          let currentParent = fileToOpen.parentFolder;
          const foldersToExpand = new Set(expandedFolders);
          while(currentParent) {
            foldersToExpand.add(currentParent);
            const parent = files.find(f => f._id === currentParent);
            currentParent = parent ? parent.parentFolder : null;
          }
          setExpandedFolders(foldersToExpand);
        }
      }
    };
    window.addEventListener('nebula_open_editor', handleOpenEditor);
    return () => window.removeEventListener('nebula_open_editor', handleOpenEditor);
  }, [files, openFiles, editorContents, expandedFolders]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!activeFileId) return;
    setIsSaving(true);
    const activeContent = editorContents[activeFileId] || '';
    try {
      const token = localStorage.getItem('nebula_token');
      const response = await fetch(`http://localhost:5000/api/files/content/${activeFileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: activeContent })
      });
      const data = await response.json();
      if (data.success) {
        // Optimistically update the files array so the dot turns green immediately
        setFiles(prev => prev.map(f => f._id === activeFileId ? { ...f, content: activeContent } : f));
        window.dispatchEvent(new CustomEvent('nebula_fs_update'));
      }
    } catch (err) {
      console.error('Failed to save file', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (!activeFile) return;

    const ext = activeFile.name.split('.').pop()?.toLowerCase();
    
    // HTML/CSS/JS Live Preview
    if (ext === 'html') {
      // Auto-save before running if unsaved
      if (editorContents[activeFile._id] !== activeFile.content) {
         await handleSave();
      }
      const url = `http://localhost:5000/api/files/serve/${activeFile.parentFolder || 'root'}/${activeFile.name}`;
      window.dispatchEvent(new CustomEvent('nebula_open_browser_intent', { detail: { url } }));
      return;
    }

    // Code Execution
    const languageMap: Record<string, string> = {
      'js': 'nodejs',
      'py': 'python',
      'cpp': 'cpp',
      'c': 'c',
      'java': 'java'
    };

    const lang = languageMap[ext || ''];
    if (!lang) {
      alert("Execution not supported for this file type.");
      return;
    }

    setIsTerminalOpen(true);
    setIsExecuting(true);
    setExecutionOutput({ stdout: 'Running...', stderr: '', executionTime: 0 });

    try {
      const contentToRun = editorContents[activeFile._id] || activeFile.content || '';
      const token = localStorage.getItem('nebula_token');
      const response = await fetch('http://localhost:5000/api/files/run', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: lang, 
          files: [{ name: activeFile.name, content: contentToRun }],
          stdin: stdinInput
        })
      });
      const data = await response.json();
      setExecutionOutput({
        stdout: data.stdout || '',
        stderr: data.stderr || data.exception || '',
        executionTime: data.executionTime || 0
      });
    } catch (e: any) {
      setExecutionOutput({ stdout: '', stderr: 'Execution Failed: ' + e.message, executionTime: 0 });
    } finally {
      setIsExecuting(false);
    }
  };

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

  const activeFile = files.find(f => f._id === activeFileId);

  return (
    <div className="w-full h-full flex bg-[#120a1c] text-white font-sans text-sm relative">
      
      {/* Sidebar */}
      <div 
        className={cn(
          "h-full border-r border-white/5 flex flex-col bg-[#0a0514] transition-all duration-300 shrink-0",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest bg-black/20">
          <span>Explorer</span>
          <button 
            onClick={() => setIsSelectingRoot(!isSelectingRoot)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-cyan-400"
            title="Select Root Folder"
          >
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500 flex items-center text-xs">
              <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> Loading...
            </div>
          ) : isSelectingRoot ? (
            <div className="px-2">
              <div className="text-xs text-gray-500 mb-2 px-2 uppercase font-semibold">Select Root Folder</div>
              <button 
                onClick={() => { setRootFolderId(null); setIsSelectingRoot(false); }} 
                className="w-full text-left px-2 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-white/5 rounded flex items-center"
              >
                <Folder className="w-3 h-3 mr-2" /> / (Home)
              </button>
              {files.filter(f => f.type === 'folder').map(folder => (
                <button 
                  key={folder._id} 
                  onClick={() => { setRootFolderId(folder._id); setIsSelectingRoot(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded truncate flex items-center"
                >
                  <Folder className="w-3 h-3 mr-2 opacity-50" /> {folder.name}
                </button>
              ))}
            </div>
          ) : (
            <>
              {rootFolderId && (
                 <button 
                   onClick={() => setRootFolderId(null)} 
                   className="mx-4 mb-2 flex items-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-2 py-1 rounded"
                 >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
                 </button>
              )}
              {files
                .filter(f => f.parentFolder === rootFolderId)
                .sort((a,b) => (a.type === 'folder' ? -1 : 1) - (b.type === 'folder' ? -1 : 1) || a.name.localeCompare(b.name))
                .map(item => (
                  <FileTreeNode 
                    key={item._id}
                    item={item}
                    depth={0}
                    files={files}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    openFile={openFile}
                    activeFileId={activeFileId}
                    editorContents={editorContents}
                  />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#120a1c]">
        
        {/* Topbar / Tabs */}
        <div className="flex flex-col shrink-0">
          <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0514]">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {activeFileId && (
                <>
                  <button 
                    onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors bg-white/5 text-gray-400 hover:bg-white/10"
                  >
                    <TerminalIcon className="w-3 h-3" />
                    <span>Terminal</span>
                  </button>
                  <button 
                    onClick={handleRun}
                    disabled={isExecuting}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                  >
                    <Play className={cn("w-3 h-3", isExecuting && "animate-pulse")} />
                    <span>{activeFile?.name.endsWith('.html') ? 'Preview' : 'Run'}</span>
                  </button>
                </>
              )}
              <button 
                onClick={handleSave}
                disabled={!activeFileId || isSaving}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors",
                  !activeFileId ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : isSaving ? "bg-cyan-900 text-cyan-500" 
                  : "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                )}
              >
                {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                <span>Save</span>
              </button>
            </div>
          </div>
          
          {/* Tabs Bar */}
          {openFiles.length > 0 && (
            <div className="flex bg-[#0a0514] overflow-x-auto border-b border-white/5 custom-scrollbar">
              {openFiles.map(file => {
                const { icon: Icon, colorClass } = getFileIconData(file.name);
                const isActive = activeFileId === file._id;
                const isUnsaved = editorContents[file._id] !== undefined && editorContents[file._id] !== (file.content || '');
                return (
                  <div 
                    key={file._id}
                    onClick={() => setActiveFileId(file._id)}
                    className={cn(
                      "flex items-center px-4 py-2 border-r border-white/5 cursor-pointer min-w-max group transition-colors",
                      isActive ? "bg-[#120a1c] border-t-2 border-t-cyan-500 text-white" : "bg-[#0a0514] border-t-2 border-t-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5 mr-2 shrink-0 transition-colors", isActive ? colorClass : "opacity-70 group-hover:opacity-100")} />
                    <span className="text-xs mr-4">{file.name}</span>
                    
                    <div className="flex items-center">
                      <span className={cn(
                        "w-2 h-2 rounded-full mr-2 transition-colors",
                        isUnsaved ? "bg-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" : "bg-green-500/50 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                      )} title={isUnsaved ? "Unsaved changes" : "Saved"} />
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFile(file._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Editor Instance */}
        <div className="flex-1 relative flex flex-col min-h-0">
          {!activeFile ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 select-none bg-[#0a0514]">
              <Code2 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Nebula Code Editor</p>
              <p className="text-sm mt-2">Open a file from the explorer or select a tab</p>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  language={getLanguage(activeFile.name)}
                  theme="nebula-dark"
                  value={editorContents[activeFile._id] || ''}
                  onChange={(value) => setEditorContents(prev => ({ ...prev, [activeFile._id]: value || '' }))}
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
              </div>
              
              {/* Terminal Output Pane */}
              {isTerminalOpen && (
                <div className="h-56 shrink-0 bg-[#0a0514] border-t border-white/10 flex flex-col font-mono text-sm z-10 relative">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-white/5 text-gray-400 shrink-0">
                    <span className="flex items-center text-xs uppercase tracking-wider"><TerminalIcon className="w-3.5 h-3.5 mr-2" /> Terminal</span>
                    <button onClick={() => setIsTerminalOpen(false)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                    <div className="w-1/3 border-r border-white/5 flex flex-col">
                       <div className="text-[10px] uppercase text-gray-500 px-3 pt-2 pb-1 shrink-0 bg-black/20">Standard Input (stdin)</div>
                       <textarea 
                         value={stdinInput}
                         onChange={(e) => setStdinInput(e.target.value)}
                         className="flex-1 bg-transparent resize-none outline-none text-gray-400 p-3 text-xs custom-scrollbar placeholder:text-gray-700"
                         spellCheck={false}
                         placeholder="Enter input here before running..."
                       />
                    </div>
                    <div className="flex-1 flex flex-col">
                       <div className="text-[10px] uppercase text-gray-500 px-3 pt-2 pb-1 shrink-0 bg-black/20">Output</div>
                       <div className="flex-1 overflow-y-auto p-3 custom-scrollbar text-gray-300 text-xs">
                         {executionOutput?.stderr && <div className="text-red-400 whitespace-pre-wrap">{executionOutput.stderr}</div>}
                         {executionOutput?.stdout && <div className="whitespace-pre-wrap">{executionOutput.stdout}</div>}
                         {!isExecuting && executionOutput && <div className="mt-2 text-gray-500 text-[10px] border-t border-white/5 pt-2">Finished in {executionOutput.executionTime}ms</div>}
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
