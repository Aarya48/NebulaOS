import { useState, useRef, useEffect } from 'react';

export type TerminalLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};

export function TerminalApp() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'NebulaOS Terminal v2.0.0' },
    { type: 'system', content: 'Type "help" for a list of commands.' },
    { type: 'system', content: '' }
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null, name: string}[]>([
    { id: null, name: 'Home' }
  ]);
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const getPathStr = () => {
    return breadcrumbs.map(b => b.name).join('\\');
  };

  const currentDirStr = getPathStr();

  const fetchCurrentContents = async () => {
    const token = localStorage.getItem('nebula_token');
    const url = currentFolderId 
      ? `http://localhost:5000/api/files/folder/${currentFolderId}`
      : `http://localhost:5000/api/files/`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    return data.success ? (data.files || []) : [];
  };

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) {
        setHistory(prev => [...prev, { type: 'input', content: `${currentDirStr}>` }]);
        return;
      }
      
      const newLines: TerminalLine[] = [{ type: 'input', content: `${currentDirStr}> ${cmd}` }];
      const args = cmd.split(' ');
      const mainCmd = args[0].toLowerCase();
      const token = localStorage.getItem('nebula_token');

      setInput(''); // clear early

      try {
        if (mainCmd === 'help') {
           newLines.push(
             { type: 'output', content: 'NebulaOS Terminal Commands:' },
             { type: 'output', content: '  help                 : Show this detailed help message' },
             { type: 'output', content: '  clear                : Clear the terminal screen' },
             { type: 'output', content: '  whoami               : Display current user' },
             { type: 'output', content: '  show                 : List contents of current directory (like ls)' },
             { type: 'output', content: '  go <folder>          : Navigate to a folder (like cd)' },
             { type: 'output', content: '  go ..                : Navigate up one directory level' },
             { type: 'output', content: '  new <file>           : Create a new file (e.g., new doc.txt)' },
             { type: 'output', content: '  nest <folder>        : Create a new folder (e.g., nest Projects)' },
             { type: 'output', content: '  blackhole <item>     : Move a file or folder to the trash bin' },
             { type: 'output', content: '  blackhole -p <item>  : Permanently delete a file or folder' },
             { type: 'output', content: '  bin                  : List all items currently in the trash bin' },
             { type: 'output', content: '  star                 : List all your favorited files and folders' }
           );
        } else if (mainCmd === 'clear') {
           setHistory([]);
           return;
        } else if (mainCmd === 'whoami') {
           newLines.push({ type: 'output', content: 'sysadmin' });
        } else if (mainCmd === 'show') {
           const files = await fetchCurrentContents();
           if (files.length === 0) {
             newLines.push({ type: 'output', content: '  (empty)' });
           } else {
             files.forEach((f: any) => {
               const typeStr = f.type === 'folder' ? '<DIR>' : '     ';
               newLines.push({ type: 'output', content: `  ${typeStr}    ${f.name}` });
             });
           }
        } else if (mainCmd === 'go') {
           const target = args.slice(1).join(' ');
           if (!target) {
             newLines.push({ type: 'error', content: 'Usage: go <foldername> or go ..' });
           } else if (target === '..' || target === '../' || target === '..\\') {
             if (breadcrumbs.length > 1) {
               const newCrumbs = breadcrumbs.slice(0, -1);
               setBreadcrumbs(newCrumbs);
               setCurrentFolderId(newCrumbs[newCrumbs.length - 1].id);
             }
           } else {
             const files = await fetchCurrentContents();
             const folder = files.find((f: any) => f.name.toLowerCase() === target.toLowerCase() && f.type === 'folder');
             if (folder) {
               setBreadcrumbs(prev => [...prev, { id: folder._id, name: folder.name }]);
               setCurrentFolderId(folder._id);
             } else {
               newLines.push({ type: 'error', content: `Folder '${target}' not found.` });
             }
           }
        } else if (mainCmd === 'new') {
           const target = args.slice(1).join(' ');
           if (!target) {
             newLines.push({ type: 'error', content: 'Usage: new <filename>' });
           } else {
             const res = await fetch('http://localhost:5000/api/files/file/create', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
               body: JSON.stringify({ name: target, content: '', parentFolder: currentFolderId })
             });
             const data = await res.json();
             if (data.success) {
               newLines.push({ type: 'output', content: `Created file: ${target}` });
               window.dispatchEvent(new CustomEvent('nebula_fs_update'));
             }
             else newLines.push({ type: 'error', content: data.message });
           }
        } else if (mainCmd === 'nest') {
           const target = args.slice(1).join(' ');
           if (!target) {
             newLines.push({ type: 'error', content: 'Usage: nest <foldername>' });
           } else {
             const res = await fetch('http://localhost:5000/api/files/folder/create', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
               body: JSON.stringify({ name: target, parentFolder: currentFolderId })
             });
             const data = await res.json();
             if (data.success) {
               newLines.push({ type: 'output', content: `Created folder: ${target}` });
               window.dispatchEvent(new CustomEvent('nebula_fs_update'));
             }
             else newLines.push({ type: 'error', content: data.message });
           }
        } else if (mainCmd === 'blackhole') {
           const isPermanent = args[1] === '-p';
           const target = isPermanent ? args.slice(2).join(' ') : args.slice(1).join(' ');
           if (!target) {
             newLines.push({ type: 'error', content: 'Usage: blackhole [-p] <name>' });
           } else {
             const files = await fetchCurrentContents();
             const item = files.find((f: any) => f.name.toLowerCase() === target.toLowerCase());
             if (!item) {
               newLines.push({ type: 'error', content: `'${target}' not found.` });
             } else if (item.name === 'Desktop' && item.parentFolder === null) {
               newLines.push({ type: 'error', content: 'Cannot delete the system Desktop folder.' });
             } else {
               const url = isPermanent 
                 ? `http://localhost:5000/api/files/permanent/${item._id}`
                 : `http://localhost:5000/api/files/${item._id}`;
               const res = await fetch(url, {
                 method: 'DELETE',
                 headers: { 'Authorization': `Bearer ${token}` }
               });
               const data = await res.json();
               if (data.success) {
                 newLines.push({ type: 'output', content: isPermanent ? `Permanently deleted ${target}.` : `Moved ${target} to blackhole.` });
                 window.dispatchEvent(new CustomEvent('nebula_fs_update'));
               }
               else newLines.push({ type: 'error', content: data.message });
             }
           }
        } else if (mainCmd === 'bin') {
           const res = await fetch('http://localhost:5000/api/files/trash', { headers: { 'Authorization': `Bearer ${token}` } });
           const data = await res.json();
           if (data.success) {
             newLines.push({ type: 'output', content: '--- TRASH BIN ---' });
             if (!data.files || data.files.length === 0) {
               newLines.push({ type: 'output', content: '  (empty)' });
             } else {
               data.files.forEach((f: any) => {
                 newLines.push({ type: 'output', content: `  ${f.name} (${f.type})` });
               });
             }
           } else {
             newLines.push({ type: 'error', content: 'Failed to access bin.' });
           }
        } else if (mainCmd === 'star') {
           const res = await fetch('http://localhost:5000/api/files/favorite', { headers: { 'Authorization': `Bearer ${token}` } });
           const data = await res.json();
           if (data.success) {
             newLines.push({ type: 'output', content: '--- FAVORITES ---' });
             if (!data.files || data.files.length === 0) {
               newLines.push({ type: 'output', content: '  (empty)' });
             } else {
               data.files.forEach((f: any) => {
                 newLines.push({ type: 'output', content: `  ★ ${f.name} (${f.type})` });
               });
             }
           } else {
             newLines.push({ type: 'error', content: 'Failed to fetch stars.' });
           }
        } else {
           newLines.push({ type: 'error', content: `'${cmd}' is not recognized as an internal or external command.` });
        }
      } catch (err: any) {
        newLines.push({ type: 'error', content: `Command error: ${err.message}` });
      }
      
      setHistory(prev => [...prev, ...newLines]);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div 
      ref={terminalRef}
      className="w-full h-full bg-black text-[#33ff33] font-mono p-4 overflow-y-auto relative terminal-crt text-sm cursor-text text-left flex flex-col justify-start items-start" 
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      <style>{`
        /* Removed heavy CRT gradient effects for performance */
      `}</style>
      
      <div className="w-full max-w-full z-10 relative">
        {history.map((line, i) => {
          let borderClass = 'border-l-2 pl-3 ml-1';
          let textClass = 'text-[#33ff33]';
          
          if (line.type === 'input') {
            borderClass += ' border-[#33ff33]';
          } else if (line.type === 'error') {
            borderClass += ' border-red-500';
            textClass = 'text-red-400';
          } else if (line.type === 'system') {
            borderClass = 'pl-4'; // No border for system messages
            textClass = 'text-gray-400';
          } else {
            borderClass += ' border-gray-500';
            textClass = 'text-gray-300';
          }

          return (
            <div key={i} className={`mb-1.5 whitespace-pre-wrap w-full break-words ${borderClass} ${textClass}`}>
              {line.content}
            </div>
          );
        })}
        
        <div className="flex w-full mt-2 pl-4">
          <span className="mr-2 shrink-0">{currentDirStr}&gt;</span>
          <input 
            id="terminal-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-[#33ff33] placeholder-gray-700"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
