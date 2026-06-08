import { useState, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AppWindowProps {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
}

export function AppWindow({
  id,
  title,
  isMinimized,
  isMaximized,
  isActive,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}: AppWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <div
      style={{
        position: 'absolute',
        zIndex,
        transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(isMaximized 
          ? { top: '4rem', left: 0, width: '100vw', height: 'calc(100vh - 4rem)' } 
          : { top: '15vh', left: 'calc(50vw - 400px)', width: 800, height: 500 }
        )
      }}
      className={cn("pointer-events-none", isMinimized && "invisible delay-300")}
      onMouseDown={() => onFocus(id)}
    >
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
          opacity: isMinimized ? 0 : 1, 
          scale: isMinimized ? 0.95 : 1,
          y: isMinimized ? 50 : (isMaximized ? 0 : undefined),
          x: isMaximized ? 0 : undefined
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        drag={!isMaximized}
        dragMomentum={false}
        dragElastic={0}
        dragListener={false}
        dragControls={dragControls}
        style={{ pointerEvents: isMinimized ? 'none' : 'auto' }}
        className={cn(
          "w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-shadow duration-200 pointer-events-auto relative",
          isActive 
            ? "border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)]" 
            : "border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]",
          "bg-[#05010A]/90 backdrop-blur-3xl"
        )}
      >
      {/* Title Bar (Draggable Area) */}
      <div 
        className="h-10 bg-[#120a1c]/80 border-b border-white/5 flex items-center justify-between px-4 cursor-move select-none shrink-0 group"
        onPointerDown={(e) => {
          if (!isMaximized) dragControls.start(e);
        }}
      >
        <div className="flex items-center space-x-2">
          {/* Mac-style Window Controls */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 flex items-center justify-center transition-colors"
          >
            <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 flex items-center justify-center transition-colors"
          >
            <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
            className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 flex items-center justify-center transition-colors"
          >
            <Square className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        
        <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {title}
        </div>
        
        <div className="w-16"></div> {/* Spacer for symmetry */}
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden relative cursor-default">
        {children}
      </div>
    </motion.div>
  </div>
  );
}
