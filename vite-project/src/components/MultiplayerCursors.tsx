import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface CursorData {
  socketId: string;
  username: string;
  x: number;
  y: number;
}

export const MultiplayerCursors: React.FC = () => {
  const [cursors, setCursors] = useState<{ [key: string]: CursorData }>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the backend
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.on('cursor-move', (data: CursorData) => {
      setCursors((prev) => ({
        ...prev,
        [data.socketId]: data,
      }));
    });

    socket.on('cursor-disconnect', ({ socketId }: { socketId: string }) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
    });

    // Throttled mouse move listener
    let lastEmitTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmitTime > 30) { // ~30fps update rate
        socket.emit('cursor-move', {
          x: e.clientX,
          y: e.clientY,
        });
        lastEmitTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {Object.values(cursors).map((cursor) => (
        <div
          key={cursor.socketId}
          className="pointer-events-none fixed z-[9999]"
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Custom SVG cursor matching theme */}
          <svg
            className="w-6 h-6 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <path
              fill="currentColor"
              d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
            />
          </svg>
          
          {/* Nametag */}
          <div className="absolute top-6 left-6 bg-[#0a0514]/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md px-2 py-1 font-mono text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.2)] rounded whitespace-nowrap">
            {cursor.username}
          </div>
        </div>
      ))}
    </>
  );
};
