import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
          
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl md:text-6xl font-light text-white uppercase tracking-widest mb-6">
              System <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Manual</span>
            </h1>
            <p className="text-xl text-gray-400 font-light mb-16 border-l-2 border-fuchsia-500 pl-6">
              Welcome to the official documentation for NebulaOS. Below you will find comprehensive guides on interacting with the kernel, file system, and terminal environments.
            </p>

            <div className="space-y-12">
              <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4">1. The File System</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  NebulaOS features a robust virtual file system powered by MongoDB. Files and folders created on your desktop or through the File Explorer are automatically synced to your cloud profile.
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Right-click anywhere to create a new folder or file.</li>
                  <li>Double-click folders to navigate deeply.</li>
                  <li>Drag and drop support allows seamless restructuring of your directory tree.</li>
                </ul>
              </section>

              <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4">2. Real-Time Collaboration</h2>
                <p className="text-gray-300 leading-relaxed">
                  Every active session on NebulaOS is broadcasted via Socket.IO. You will instantly see the cursors of other authenticated users flying across your screen in real-time. This provides a truly multiplayer operating system experience with zero polling latency.
                </p>
              </section>

              <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <h2 className="text-2xl text-white font-bold tracking-widest uppercase mb-4">3. Code Execution</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The built-in Code Editor connects directly to the OneCompiler API through a secure proxy routing layer on the backend. This allows you to compile C++, Python, JavaScript, and Java natively without exposing API credentials.
                </p>
                <div className="bg-black/50 border border-white/5 p-4 rounded-lg font-mono text-sm text-cyan-300">
                  <p>// Example: Running Python</p>
                  <p>print("Hello from NebulaOS!")</p>
                </div>
              </section>
            </div>
            
          </div>
        </div>
      </StarsBackground>
    </div>
  );
}
