import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function OSPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic Auth Check
    const token = localStorage.getItem('nebula_token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nebula_token');
    navigate('/');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: '0 auto', overflow: 'hidden' }}>
      
      {/* Top OS Navbar Placeholder */}
      <nav className="absolute top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-8 bg-[#05010A]/80 backdrop-blur-md border-b border-white/5 shadow-md">
        <div className="flex items-center space-x-4">
          {/* OS LOGO */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <img src="/file_000000006bd471f893e5a640a1e02db2.png" alt="NebulaOS Logo" className="w-full h-full object-contain" />
          </div>
          
          <span className="text-lg font-light tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Nebula</span>
            <span className="font-bold text-white">OS</span>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-xs text-gray-400 font-mono">Status: <span className="text-green-400">ONLINE</span></span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            DISCONNECT
          </Button>
        </div>
      </nav>

      {/* Main Background */}
      <StarsBackground
        starColor="#E2E8F0"
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center pt-16',
          'bg-[#05010A]'
        )}
      >
        {/* Subtle geometric grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none"></div>
        
        {/* Main Content Area Placeholder */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-2xl px-6">
            
            {/* Large Center Logo */}
            <div className="w-32 h-32 mb-8 flex items-center justify-center relative group transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl"></div>
              <img src="/file_000000006bd471f893e5a640a1e02db2.png" alt="NebulaOS Large Logo" className="w-32 h-32 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
            </div>

            <h1 className="text-3xl md:text-5xl font-light text-white tracking-widest uppercase mb-4 animate-in slide-in-from-bottom-4 fade-in duration-1000">
              System <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Initialized</span>
            </h1>
            <p className="text-gray-400 tracking-wide font-light mb-8 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-150">
              Welcome to the central command dashboard. Your file system and terminal tools will be available here soon.
            </p>
            
          </div>
        </div>

      </StarsBackground>
    </div>
  );
}
