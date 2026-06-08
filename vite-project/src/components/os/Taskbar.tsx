import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Terminal, FolderOpen, Eclipse, Code2, Globe, Settings } from 'lucide-react';

export interface TaskbarProps {
  windows: Array<{ id: string; type: string; title: string; isMinimized: boolean; isActive: boolean }>;
  onWindowClick: (id: string) => void;
}

const WINDOW_TYPES = {
  terminal: { icon: Terminal, color: 'text-green-400' },
  files: { icon: FolderOpen, color: 'text-os-main' },
  blackhole: { icon: Eclipse, color: 'text-red-400' },
  editor: { icon: Code2, color: 'text-yellow-400' },
  browser: { icon: Globe, color: 'text-blue-400' },
  settings: { icon: Settings, color: 'text-gray-400' }
};

export function Taskbar({ windows, onWindowClick }: TaskbarProps) {
  if (windows.length === 0) return null;

  return (
    <div className="absolute bottom-4 inset-x-0 flex justify-center z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center space-x-2 bg-[#05010A]/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
      >
        {windows.map((win) => {
          const config = WINDOW_TYPES[win.type as keyof typeof WINDOW_TYPES] || WINDOW_TYPES.files;
          const Icon = config.icon;
          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group hover:bg-white/5",
                win.isActive ? "bg-white/10" : ""
              )}
              title={win.title}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-colors",
                  config.color
                )}
              />
              
              {/* Active Indicator */}
              {win.isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"></div>
              )}
              
              {/* Open Indicator */}
              {!win.isActive && !win.isMinimized && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/50"></div>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
