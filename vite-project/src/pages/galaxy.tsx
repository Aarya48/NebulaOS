import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { LiquidButton } from '@/components/animate-ui/components/buttons/liquid';
import { cn } from '@/lib/utils';
import { Layout, Cpu, FolderTree, Terminal } from 'lucide-react';

export default function GalaxyPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>
      
      {/* Top Navbar */}
      <nav className="absolute top-0 inset-x-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 bg-[#05010A]/50 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center cursor-pointer">
          <span className="text-xl md:text-2xl font-light tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
            <span className="font-bold text-white">OS</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Features</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Docs</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest uppercase">Community</a>
        </div>

        <div className="flex items-center">
          <button className="text-xs tracking-widest uppercase font-semibold text-black bg-white hover:bg-gray-200 px-6 py-3 rounded-none transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
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
        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center px-6 scrollbar-hide">
          
          {/* Hero Section - Takes full viewport height */}
          <div className="flex flex-col items-center justify-center min-h-screen space-y-12 animate-in fade-in zoom-in duration-[2000ms] ease-out w-full max-w-6xl shrink-0">
            <div className="flex flex-col items-center mt-10">
              <h1 className="text-5xl md:text-8xl font-light tracking-[0.2em] text-white uppercase drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] text-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">Nebula</span>
                <span className="font-bold text-white">OS</span>
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <LiquidButton 
                size="lg" 
                className="w-56 h-14 text-xs tracking-[0.2em] uppercase font-medium rounded-none border border-cyan-500/50 [--liquid-button-background-color:rgba(6,182,212,0.1)] [--liquid-button-color:#06b6d4] text-cyan-300 hover:text-black shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
              >
                Initiate
              </LiquidButton>
              <LiquidButton 
                size="lg" 
                className="w-56 h-14 text-xs tracking-[0.2em] uppercase font-medium rounded-none border border-fuchsia-500/30 [--liquid-button-background-color:transparent] [--liquid-button-color:rgba(217,70,239,0.2)] text-fuchsia-300/80 hover:text-white hover:border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all"
              >
                Documentation
              </LiquidButton>
            </div>
          </div>

          {/* Feature Cards Section - Premium, large, wide layout */}
          <div className="w-full max-w-[90vw] 2xl:max-w-[1400px] pb-32 flex flex-col items-center justify-start shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pt-8">
              {[
                { icon: Layout, title: "Seamless UI", desc: "Experience fluid navigation and an intuitive interface designed for maximum productivity and striking visual aesthetics." },
                { icon: Cpu, title: "Compile Code", desc: "Lightning fast execution for all major programming languages, backed by distributed zero-latency cloud infrastructure." },
                { icon: FolderTree, title: "Perfect File System", desc: "A highly organized, robust storage solution that scales effortlessly with your complex project needs." },
                { icon: Terminal, title: "Inbuilt Terminal", desc: "Powerful, deeply integrated command line tools available right out of the box without any complicated configuration." },
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="group relative flex flex-col justify-center p-10 md:p-14 min-h-[300px] bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.06)]"
                >
                  {/* Subtle top glare for premium Apple/Vercel feel */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <card.icon className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors duration-500 relative z-10 mb-8" strokeWidth={1.5} />
                  
                  <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide relative z-10 mb-4">{card.title}</h3>
                  <p className="text-base md:text-lg text-gray-400 font-light relative z-10 leading-relaxed max-w-xl">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </StarsBackground>
    </div>
  );
}
