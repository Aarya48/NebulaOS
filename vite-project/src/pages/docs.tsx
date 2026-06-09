import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderTree, Users, Terminal, Code2, Sparkles, Command } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from '@/components/animate-ui/components/animate/tabs';

export default function DocsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>
      
      {/* Top Navbar */}
      <nav className="absolute top-0 inset-x-0 h-20 z-50 flex items-center px-8 lg:px-16 bg-[#05010A]/50 backdrop-blur-lg border-b border-white/5">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-widest uppercase">Back to Home</span>
        </button>
        <div className="flex-1"></div>
        <span className="text-xl md:text-2xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
          <span className="font-bold text-white">Docs</span>
        </span>
      </nav>

      <StarsBackground
        starColor="#E2E8F0"
        className={cn(
          'absolute inset-0 flex flex-col',
          'bg-[radial-gradient(ellipse_at_bottom,_#2D1B4E_0%,_#0B0B0E_100%)]'
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 w-full h-full overflow-y-auto px-8 xl:px-24 pt-32 pb-24 scrollbar-hide flex flex-col items-center">
          
          <div className="w-full">
            <h1 className="text-4xl md:text-6xl font-light text-white uppercase tracking-widest mb-6">
              System <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Manual</span>
            </h1>
            <p className="text-xl text-gray-400 font-light mb-16 border-l-2 border-fuchsia-500 pl-6">
              Welcome to the official documentation for NebulaOS. Below you will find comprehensive guides on interacting with the kernel, file system, and terminal environments.
            </p>

            <Tabs defaultValue="filesystem" className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="w-full lg:w-64 shrink-0">
                <TabsList className="bg-white/5 border border-white/10 p-2 flex-col w-full h-auto rounded-2xl">
                  <TabsTrigger value="filesystem" className="px-6 py-3 justify-start rounded-xl w-full"><FolderTree className="w-4 h-4 mr-3" /> File System</TabsTrigger>
                  <TabsTrigger value="collaboration" className="px-6 py-3 justify-start rounded-xl w-full"><Users className="w-4 h-4 mr-3" /> Collaboration</TabsTrigger>
                  <TabsTrigger value="execution" className="px-6 py-3 justify-start rounded-xl w-full"><Code2 className="w-4 h-4 mr-3" /> Execution</TabsTrigger>
                  <TabsTrigger value="terminal" className="px-6 py-3 justify-start rounded-xl w-full"><Terminal className="w-4 h-4 mr-3" /> Terminal</TabsTrigger>
                </TabsList>
              </div>

              <TabsContents className="flex-1 w-full m-0 min-w-0">
                <TabsContent value="filesystem" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-8">
                  <div>
                    <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4 flex items-center"><FolderTree className="w-6 h-6 mr-3 text-cyan-400" /> Virtual File System</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      NebulaOS features a robust, state-of-the-art virtual file system powered by MongoDB and Cloudinary. It provides a localized OS experience while maintaining absolute cloud synchronization, meaning your digital workspace persists across sessions.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg text-white font-semibold mb-3 border-b border-white/10 pb-2">Directory Architecture</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          The system utilizes a relational <span className="text-cyan-400">parent-child tree structure</span>. Every folder and file acts as a distinct node in the database. When you double-click a folder, the OS dynamically fetches all child nodes where <code className="text-fuchsia-400">parentFolder</code> matches the current directory's unique ID.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg text-white font-semibold mb-3 border-b border-white/10 pb-2">File Imports & Code Execution</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Inside the built-in Code Editor, you can create interconnected projects. For web applications (HTML/CSS/JS), the system bundles your raw text nodes and serves them into a secure, sandboxed `<iframe />`. For backend languages like Python or C++, the code is securely proxied to the OneCompiler distributed network—completely bypassing CORS and ensuring zero-latency execution.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#05010A] p-5 rounded-xl border border-white/10 font-mono text-sm relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
                      <p className="text-xs text-gray-500 mb-3 border-b border-white/5 pb-2">// Internal Data Schema</p>
                      <div className="space-y-2 relative z-10">
                        <p><span className="text-fuchsia-400">const</span> <span className="text-blue-300">FileNode</span> = {'{'}</p>
                        <p className="pl-4"><span className="text-cyan-300">_id</span>: <span className="text-green-400">"65a2b4..."</span>,</p>
                        <p className="pl-4"><span className="text-cyan-300">name</span>: <span className="text-green-400">"App.tsx"</span>,</p>
                        <p className="pl-4"><span className="text-cyan-300">type</span>: <span className="text-green-400">"file"</span>,</p>
                        <p className="pl-4"><span className="text-cyan-300">parentFolder</span>: <span className="text-green-400">"65a2b0..."</span> <span className="text-gray-500">// Links to root</span></p>
                        <p className="pl-4"><span className="text-cyan-300">content</span>: <span className="text-green-400">"import React..."</span></p>
                        <p>{'}'}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 relative z-10">
                        <p className="text-xs text-gray-500 mb-2">// Query Resolution</p>
                        <p className="text-gray-300">SELECT * FROM <span className="text-fuchsia-400">fs_nodes</span></p>
                        <p className="text-gray-300">WHERE <span className="text-cyan-300">parentFolder</span> = <span className="text-green-400">CURRENT_DIR</span></p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="collaboration" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-8">
                  <div>
                    <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4 flex items-center"><Users className="w-6 h-6 mr-3 text-cyan-400" /> Real-Time Collaboration</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      NebulaOS breaks the isolation of traditional operating systems. It is engineered from the ground up to be a completely multiplayer environment. Every action, window movement, and keystroke can be broadcasted globally through a low-latency WebSockets layer powered by Socket.IO.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-lg text-white font-semibold mb-2 relative z-10">Live Cursor Tracking</h3>
                        <p className="text-gray-400 text-sm relative z-10 leading-relaxed">
                          You will instantly see the cursors of other authenticated users flying across your screen in real-time, completely synchronized down to the pixel. This is achieved by debouncing pointer coordinates and pushing a binary delta stream across the socket connection.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg text-white font-semibold mb-3 border-b border-white/10 pb-2">Socket Architecture</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          When a user logs in, they establish a persistent, bidirectional WebSocket connection. The server maintains a unified room state. If a user creates a new file, renames a directory, or opens an app, the server emits a <code className="text-cyan-300">broadcast</code> event to all connected clients to instantly mirror the state change.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#05010A] p-5 rounded-xl border border-white/10 font-mono text-sm relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-2xl rounded-full pointer-events-none"></div>
                      <p className="text-xs text-gray-500 mb-3 border-b border-white/5 pb-2">// Socket Implementation Spec</p>
                      <div className="space-y-2 relative z-10">
                        <p><span className="text-fuchsia-400">export function</span> <span className="text-blue-300">initSockets</span>(io) {'{'}</p>
                        <p className="pl-4">io.<span className="text-cyan-300">on</span>(<span className="text-green-400">'connection'</span>, (socket) {`=>`} {'{'}</p>
                        <p className="pl-8"><span className="text-gray-500">// Listen for cursor updates</span></p>
                        <p className="pl-8">socket.<span className="text-cyan-300">on</span>(<span className="text-green-400">'cursor_move'</span>, (data) {`=>`} {'{'}</p>
                        <p className="pl-12">socket.<span className="text-cyan-300">broadcast</span>.<span className="text-cyan-300">emit</span>(<span className="text-green-400">'user_cursor'</span>, {'{'}</p>
                        <p className="pl-16"><span className="text-cyan-300">userId</span>: socket.id,</p>
                        <p className="pl-16"><span className="text-cyan-300">x</span>: data.x, <span className="text-cyan-300">y</span>: data.y</p>
                        <p className="pl-12">{'}'});</p>
                        <p className="pl-8">{'}'});</p>
                        <p className="pl-4">{'}'});</p>
                        <p>{'}'}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 relative z-10">
                        <p className="text-xs text-gray-500 mb-2">// Performance</p>
                        <p className="text-gray-300">Transport: <span className="text-fuchsia-400">WebSocket / Polling Fallback</span></p>
                        <p className="text-gray-300">Average Latency: <span className="text-green-400">~12ms</span></p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="execution" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4 flex items-center"><Code2 className="w-6 h-6 mr-3 text-cyan-400" /> Sandboxed Execution</h2>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    The built-in Code Editor connects directly to the OneCompiler distributed execution network through a secure proxy routing layer on our backend.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-gray-400 mb-4">
                        This architecture allows you to compile and execute complex algorithms in C++, Python, Node.js, and Java natively without exposing API credentials to the client side. Live web projects (HTML/CSS/JS) are rendered instantly via secure cross-origin iframes.
                      </p>
                    </div>
                    <div className="bg-[#0B0B12] border border-white/10 rounded-lg overflow-hidden">
                      <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        <span className="text-xs text-gray-500 ml-2 font-mono">main.py</span>
                      </div>
                      <div className="p-4 font-mono text-sm">
                        <p className="text-fuchsia-400">def <span className="text-cyan-300">init_nebula</span>():</p>
                        <p className="text-gray-300 pl-4">print(<span className="text-green-400">"Zero latency deployed."</span>)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="terminal" className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] space-y-8">
                  <div>
                    <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4 flex items-center"><Terminal className="w-6 h-6 mr-3 text-cyan-400" /> Terminal Emulation</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      A fully-fledged command line interface engineered from scratch. It directly hooks into the NebulaOS kernel, providing deep, command-driven interactions with the virtual file system without needing the graphical explorer.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Navigation & Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg text-white font-semibold mb-3 border-b border-white/10 pb-2">Navigation & Info</h3>
                      <div className="space-y-3 font-mono text-sm">
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-cyan-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">show</span></p>
                          <p className="text-gray-400 mt-1">List all contents of the current directory. Similar to <code className="text-gray-500">ls</code> in UNIX.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-cyan-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">go</span> <span className="text-fuchsia-400">&lt;folder&gt;</span></p>
                          <p className="text-gray-400 mt-1">Navigate into a specific folder, or use <code className="text-cyan-300">go ..</code> to step up one directory.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-cyan-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">whoami</span></p>
                          <p className="text-gray-400 mt-1">Display the currently authenticated user's system profile.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-cyan-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">help / clear</span></p>
                          <p className="text-gray-400 mt-1">Display the help manual, or wipe the terminal buffer.</p>
                        </div>
                      </div>
                    </div>

                    {/* File Operations */}
                    <div className="space-y-4">
                      <h3 className="text-lg text-white font-semibold mb-3 border-b border-white/10 pb-2">File Operations</h3>
                      <div className="space-y-3 font-mono text-sm">
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-fuchsia-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">new</span> <span className="text-fuchsia-400">&lt;file&gt;</span></p>
                          <p className="text-gray-400 mt-1">Initialize a new empty file in the current directory (e.g., <code className="text-cyan-300">new doc.txt</code>).</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-fuchsia-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">nest</span> <span className="text-fuchsia-400">&lt;folder&gt;</span></p>
                          <p className="text-gray-400 mt-1">Create a new nested directory within the current path.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-fuchsia-500/50 transition-colors">
                          <p><span className="text-cyan-400 font-bold">rename</span> <span className="text-fuchsia-400">&lt;old&gt; &lt;new&gt;</span></p>
                          <p className="text-gray-400 mt-1">Rename an existing file or folder. Use quotes if names contain spaces.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg hover:border-red-500/50 transition-colors group">
                          <p><span className="text-red-400 font-bold group-hover:text-red-300">blackhole</span> <span className="text-gray-400">[-p]</span> <span className="text-fuchsia-400">&lt;item&gt;</span></p>
                          <p className="text-gray-400 mt-1">Move an item to the trash bin. Append the <code className="text-red-300">-p</code> flag to permanently erase it from existence.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#05010A] p-4 rounded-xl border border-white/10 font-mono text-sm flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 mr-4">// Utilities:</span>
                      <span className="text-cyan-400 font-bold mr-2">bin</span> <span className="text-gray-400">(View trash)</span>
                      <span className="text-gray-500 mx-4">|</span>
                      <span className="text-cyan-400 font-bold mr-2">star</span> <span className="text-gray-400">(List favorites)</span>
                    </div>
                  </div>
                </TabsContent>

              </TabsContents>
            </Tabs>
            
          </div>
        </div>
      </StarsBackground>
    </div>
  );
}
