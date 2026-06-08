import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Terminal as TerminalIcon, 
  Settings, 
  Bell, 
  Battery,
  BatteryCharging,
  BatteryFull, 
  BatteryMedium,
  BatteryLow,
  LogOut 
} from 'lucide-react';

export default function OSPage() {
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState<{ level: number, charging: boolean } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBattery({ level: batt.level, charging: batt.charging });
        
        batt.addEventListener('levelchange', () => {
          setBattery(prev => prev ? { ...prev, level: batt.level } : { level: batt.level, charging: batt.charging });
        });
        batt.addEventListener('chargingchange', () => {
          setBattery(prev => prev ? { ...prev, charging: batt.charging } : { level: batt.level, charging: batt.charging });
        });
      });
    }
  }, []);

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
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4 pr-8 border-r border-white/10">
            {/* OS LOGO */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <img src="/file_000000006bd471f893e5a640a1e02db2.png" alt="NebulaOS Logo" className="w-full h-full object-contain" />
            </div>
            
            <span className="text-lg font-light tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Nebula</span>
              <span className="font-bold text-white">OS</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors group">
              <FolderOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest">Files</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-fuchsia-400 transition-colors group">
              <TerminalIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest">Terminal</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors group">
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest">Settings</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Status Icons */}
          <div className="flex items-center space-x-4 text-gray-400">
            {battery && (
              <div className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors" title={`${Math.round(battery.level * 100)}%`}>
                {battery.charging ? (
                  <BatteryCharging className="w-5 h-5 text-green-400" />
                ) : battery.level > 0.8 ? (
                  <BatteryFull className="w-5 h-5" />
                ) : battery.level > 0.4 ? (
                  <BatteryMedium className="w-5 h-5" />
                ) : battery.level > 0.15 ? (
                  <BatteryLow className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Battery className="w-5 h-5 text-red-500" />
                )}
                <span className="text-xs font-mono">{Math.round(battery.level * 100)}%</span>
              </div>
            )}
            {!battery && <BatteryFull className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />}
            <Bell className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>

          {/* Clock */}
          <div className="flex items-center px-4 border-l border-white/10 text-sm font-mono text-gray-300 tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4" />
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
        
        {/* Main Content Area placeholder removed for clean desktop look */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
        </div>

      </StarsBackground>
    </div>
  );
}
