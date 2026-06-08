import { useState, useRef, useEffect } from 'react';

export type TerminalLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};

export function TerminalApp() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'system', content: 'NebulaOS Terminal v1.0.0' },
    { type: 'system', content: 'Type "help" for a list of commands.' },
    { type: 'system', content: '' }
  ]);
  const [currentDir, setCurrentDir] = useState('C:\\NebulaOS');
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) {
        setHistory(prev => [...prev, { type: 'input', content: `${currentDir}>` }]);
        return;
      }
      
      let newLines: TerminalLine[] = [{ type: 'input', content: `${currentDir}> ${cmd}` }];
      const lowerCmd = cmd.toLowerCase();
      
      if (lowerCmd === 'help') {
         newLines.push({ type: 'output', content: 'Available commands: help, clear, whoami, ls, cd' });
      } else if (lowerCmd === 'clear') {
         setHistory([]);
         setInput('');
         return;
      } else if (lowerCmd === 'whoami') {
         newLines.push({ type: 'output', content: 'sysadmin' });
      } else if (lowerCmd === 'ls') {
         newLines.push(
           { type: 'output', content: 'Directory of C:\\NebulaOS' },
           { type: 'output', content: '  <DIR>    system32' },
           { type: 'output', content: '  <DIR>    logs' },
           { type: 'output', content: '  1200     config.json' }
         );
      } else if (lowerCmd.startsWith('cd ')) {
         const newDir = cmd.substring(3).trim();
         setCurrentDir(`C:\\NebulaOS\\${newDir}`);
      } else {
         newLines.push({ type: 'error', content: `'${cmd}' is not recognized as an internal or external command.` });
      }
      
      setHistory(prev => [...prev, ...newLines]);
      setInput('');
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
        .terminal-crt::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        .terminal-crt {
          text-shadow: 0 0 5px rgba(51, 255, 51, 0.5);
        }
      `}</style>
      
      <div className="w-full max-w-full">
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
          <span className="mr-2 shrink-0">{currentDir}&gt;</span>
        <input 
          id="terminal-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none text-[#33ff33]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  </div>
  );
}
