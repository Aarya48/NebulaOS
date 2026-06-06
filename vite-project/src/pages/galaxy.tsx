import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { LiquidButton } from '@/components/animate-ui/components/buttons/liquid';
import { cn } from '@/lib/utils';
import { Layout, Cpu, FolderTree, Terminal } from 'lucide-react';

export default function GalaxyPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>

      {/* Top Navbar */}
      <nav className="absolute top-0 inset-x-0 h-20 z-50 flex items-center justify-between px-8 lg:px-16 bg-[#05010A]/50 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center cursor-pointer">
          <span className="text-xl md:text-2xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
            <span className="font-bold text-white">OS</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-12">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Features</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Docs</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Community</a>
        </div>

        <div className="flex items-center">
          <button className="text-xs tracking-widest uppercase font-semibold text-black bg-white hover:bg-gray-200 px-8 py-3 rounded-none transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Launch App
          </button>
        </div>
      </nav>

      <StarsBackground
        starColor="#E2E8F0"
        className={cn(
          'absolute inset-0 flex flex-col',
          'bg-[radial-gradient(ellipse_at_bottom,_#2D1B4E_0%,_#0B0B0E_100%)]'
        )}
      >
        {/* Subtle geometric grid overlay to give texture to the empty sides */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

        {/* Removed max-w constraints. Padding px-8 xl:px-24 ensures it stretches wide across the entire screen */}
        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center px-8 xl:px-24 scrollbar-hide">

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center min-h-screen space-y-12 animate-in fade-in zoom-in duration-[2000ms] ease-out w-full shrink-0">
            <div className="flex flex-col items-center mt-10">
              <h1 className="text-5xl md:text-[9rem] font-light tracking-[0.1em] text-white uppercase drop-shadow-[0_0_60px_rgba(168,85,247,0.5)] text-center leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
                <span className="font-bold text-white">OS</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <LiquidButton
                size="lg"
                className="w-64 h-16 text-sm tracking-[0.2em] uppercase font-bold rounded-none border border-cyan-500/50 [--liquid-button-background-color:rgba(6,182,212,0.1)] [--liquid-button-color:#06b6d4] text-cyan-300 hover:text-black shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all"
              >
                Initiate
              </LiquidButton>
              <LiquidButton
                size="lg"
                className="w-64 h-16 text-sm tracking-[0.2em] uppercase font-bold rounded-none border border-fuchsia-500/30 [--liquid-button-background-color:transparent] [--liquid-button-color:rgba(217,70,239,0.2)] text-fuchsia-300/80 hover:text-white hover:border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all"
              >
                Documentation
              </LiquidButton>
            </div>
          </div>

          {/* Feature Cards Section - Now stretching across 4 columns on large screens to fill empty sides */}
          <div className="w-full pb-32 flex flex-col items-center justify-start shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full pt-8">
              {[
                { icon: Layout, title: "Seamless UI", desc: "Experience fluid navigation and an intuitive interface designed for maximum productivity and striking visual aesthetics." },
                { icon: Cpu, title: "Compile Code", desc: "Lightning fast execution for all major programming languages, backed by distributed zero-latency cloud infrastructure." },
                { icon: FolderTree, title: "Perfect File System", desc: "A highly organized, robust storage solution that scales effortlessly with your complex project needs." },
                { icon: Terminal, title: "Inbuilt Terminal", desc: "Powerful, deeply integrated command line tools available right out of the box without any complicated configuration." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col justify-center p-10 min-h-[300px] bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.06)]"
                >
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <card.icon className="w-10 h-10 text-cyan-400 group-hover:text-fuchsia-400 transition-colors duration-500 relative z-10 mb-8" strokeWidth={1.5} />

                  <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide relative z-10 mb-4">{card.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 font-light relative z-10 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase Section - Framed as Screenshot Windows */}
          <div className="w-full pb-48 flex flex-col items-center justify-start shrink-0">
            <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-widest mb-16 self-start pl-8 border-l-2 border-cyan-500">
              Platform Interface
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full h-auto min-h-[900px]">
              
              {/* Screenshot 1: Large left */}
              <div className="md:col-span-7 relative rounded-xl overflow-hidden group border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-[#05010A]">
                {/* Fake Window Header */}
                <div className="absolute top-0 inset-x-0 h-10 bg-[#120a1c] border-b border-white/5 flex items-center px-4 space-x-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200')" }}></div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="absolute bottom-10 left-10 right-10 z-30">
                  <h3 className="text-3xl font-bold text-white tracking-widest uppercase mb-2 drop-shadow-lg">Dashboard View</h3>
                  <p className="text-gray-300 font-light max-w-md drop-shadow-md">The main control hub ensuring zero-latency communication across all your cloud-native applications.</p>
                </div>
              </div>

              {/* Screenshot 2: Top right */}
              <div className="md:col-span-5 relative rounded-xl overflow-hidden group border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-[#05010A] min-h-[400px]">
                <div className="absolute top-0 inset-x-0 h-10 bg-[#120a1c] border-b border-white/5 flex items-center px-4 space-x-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000')" }}></div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 right-8 z-30">
                  <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2 drop-shadow-lg">File System</h3>
                  <p className="text-gray-300 font-light text-sm drop-shadow-md">A distributed file browser mapping directly to the fastest available memory shards.</p>
                </div>
              </div>

              {/* Screenshot 3: Bottom left */}
              <div className="md:col-span-5 relative rounded-xl overflow-hidden group border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-[#05010A] min-h-[400px]">
                <div className="absolute top-0 inset-x-0 h-10 bg-[#120a1c] border-b border-white/5 flex items-center px-4 space-x-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000')" }}></div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 right-8 z-30">
                  <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2 drop-shadow-lg">Terminal Mode</h3>
                  <p className="text-gray-300 font-light text-sm drop-shadow-md">Military-grade CLI securing your neural-link transmissions.</p>
                </div>
              </div>

              {/* Screenshot 4: Bottom right (wide) */}
              <div className="md:col-span-7 relative rounded-xl overflow-hidden group border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-[#05010A]">
                <div className="absolute top-0 inset-x-0 h-10 bg-[#120a1c] border-b border-white/5 flex items-center px-4 space-x-2 z-20">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200')" }}></div>
                <div className="absolute top-10 inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div className="absolute bottom-10 left-10 right-10 z-30">
                  <h3 className="text-3xl font-bold text-white tracking-widest uppercase mb-2 drop-shadow-lg">System Monitor</h3>
                  <p className="text-gray-300 font-light max-w-md drop-shadow-md">Limitless scalability tracking allowing your architecture to expand seamlessly.</p>
                </div>
              </div>

            </div>
          </div>

          {/* About OS Section */}
          <div className="w-full pb-48 pt-16 flex flex-col items-center justify-center shrink-0">
            <div className="max-w-4xl text-center space-y-8 relative">
              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
              
              <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-[0.2em] relative z-10">
                Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-bold">Future</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed tracking-wide relative z-10">
                NebulaOS is not just an operating system; it's a paradigm shift in computing architecture. 
                Designed from the ground up to seamlessly integrate distributed cloud environments with localized 
                hardware, it delivers an unprecedented zero-latency experience. Whether you're compiling 
                massive codebases or rendering complex neural networks, NebulaOS optimizes every 
                computational cycle to launch your productivity into the stratosphere.
              </p>
              
              <div className="pt-8 flex justify-center relative z-10">
                <button className="px-8 py-3 rounded-none border border-white/20 text-white text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                  View Repo
                </button>
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="w-full pb-48 flex flex-col items-center justify-start shrink-0">
            <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-widest mb-16 self-start pl-8 border-l-2 border-fuchsia-500">
              Core Contributors
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
              {[
                { name: "Anurag Yadav", handle: "CfRadar", color: "cyan" as const, role: "Frontend Developer" },
                { name: "Aarya Tiwari", handle: "Aarya48", color: "fuchsia" as const, role: "Backend Developer" }
              ].map((contributor, i) => (
                <a 
                  key={i} 
                  href={`https://github.com/${contributor.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center p-6 md:p-8 w-full md:w-1/3 bg-[#05010A]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-pointer hover:-translate-y-1"
                >
                  {/* Subtle hover gradient */}
                  <div className={cn(
                    "absolute inset-0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                    contributor.color === 'cyan' ? 'from-cyan-500/10' : 'from-fuchsia-500/10'
                  )}></div>
                  
                  <div className="relative z-10 flex items-center space-x-6 w-full">
                    {/* Avatar */}
                    <div className={cn(
                      "relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 transition-all duration-500 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.8)]",
                      contributor.color === 'cyan' ? 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                    )}>
                      <img src={`https://github.com/${contributor.handle}.png`} alt={contributor.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-white tracking-wide mb-1">{contributor.name}</h3>
                      <p className={cn(
                        "text-xs font-semibold tracking-widest uppercase mb-3",
                        contributor.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'
                      )}>
                        {contributor.role}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400 group-hover:text-white transition-colors w-max">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>@{contributor.handle}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <footer className="w-full mt-12 py-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
                <span className="font-bold text-white">OS</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">Privacy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-wider">Terms</a>
              <a href="#" className="text-sm text-gray-400 hover:text-fuchsia-400 transition-colors uppercase tracking-wider">Docs</a>
              <a href="#" className="text-sm text-gray-400 hover:text-fuchsia-400 transition-colors uppercase tracking-wider">GitHub</a>
            </div>
            
            <div className="text-sm text-gray-500 font-light tracking-wider">
              &copy; {new Date().getFullYear()} NebulaOS. All rights reserved.
            </div>
          </footer>

        </div>
      </StarsBackground>
    </div>
  );
}
