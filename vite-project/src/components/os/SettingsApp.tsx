import { useState } from 'react';
import { useSettings } from '@/lib/SettingsContext';
import { cn } from '@/lib/utils';
import { 
  Paintbrush, Image as ImageIcon, RotateCcw, Monitor, 
  CheckCircle2, UploadCloud, Cpu, LayoutTemplate, 
  MousePointer2, Eye, Clock, Battery, Wifi, Search 
} from 'lucide-react';

// Generic Toggle Component
const Toggle = ({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: (c: boolean) => void }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <div className="font-medium">{label}</div>
      {description && <div className="text-xs text-gray-500 mt-1 max-w-[280px]">{description}</div>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
        checked ? "bg-os-main" : "bg-white/10"
      )}
    >
      <span 
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

export function SettingsApp() {
  const { themeColor, setThemeColor, wallpaper, setWallpaper, preferences, updatePreference } = useSettings();
  const [activeTab, setActiveTab] = useState<'personalization' | 'display' | 'system'>('personalization');
  const [isUploading, setIsUploading] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColor(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        await setWallpaper(e.target.files[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleResetWallpaper = async () => {
    setIsUploading(true);
    try {
      await setWallpaper(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full flex bg-[#05010A]/80 text-white font-sans text-sm">
      {/* Sidebar */}
      <div className="w-48 bg-white/5 border-r border-white/10 p-4 flex flex-col space-y-2 shrink-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-2">Settings</div>
        
        <button
          onClick={() => setActiveTab('personalization')}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left", activeTab === 'personalization' ? "bg-os-main/20 text-os-main" : "hover:bg-white/5 text-gray-300")}
        >
          <Paintbrush className="w-4 h-4" />
          <span>Personalize</span>
        </button>
        <button
          onClick={() => setActiveTab('display')}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left", activeTab === 'display' ? "bg-os-main/20 text-os-main" : "hover:bg-white/5 text-gray-300")}
        >
          <Monitor className="w-4 h-4" />
          <span>Display</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={cn("flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors w-full text-left", activeTab === 'system' ? "bg-os-main/20 text-os-main" : "hover:bg-white/5 text-gray-300")}
        >
          <Cpu className="w-4 h-4" />
          <span>System</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        
        {/* PERSONALIZATION TAB */}
        {activeTab === 'personalization' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-light mb-8 flex items-center space-x-3">
              <Paintbrush className="text-os-main" />
              <span>Personalization</span>
            </h1>

            <section className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-os-main" />
                <span>OS Accent Color</span>
              </h2>
              <p className="text-gray-400 mb-6 text-sm">
                Choose the primary color for NebulaOS. This color is applied instantly to windows, taskbars, highlights, and borders.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={handleColorChange}
                    className="absolute -top-4 -left-4 w-24 h-24 cursor-pointer p-0 border-0"
                  />
                </div>
                <div>
                  <div className="font-mono text-xl tracking-wider uppercase text-os-main">{themeColor}</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Hex Code</div>
                </div>
              </div>
            </section>

            <section className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <LayoutTemplate className="w-5 h-5 text-os-main" />
                <span>Desktop & Taskbar</span>
              </h2>
              <Toggle 
                label="Taskbar Auto-Hide" 
                description="Automatically hide the taskbar when not hovered."
                checked={!!preferences.taskbarAutoHide} 
                onChange={(c) => updatePreference('taskbarAutoHide', c)} 
              />
              <div className="border-t border-white/10 my-4" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">Desktop Icon Size</div>
                  <div className="text-xs text-gray-500 mt-1">Adjust the size of icons on the desktop grid.</div>
                </div>
                <select 
                  value={preferences.desktopIconSize || 'medium'}
                  onChange={(e) => updatePreference('desktopIconSize', e.target.value as 'small' | 'medium' | 'large')}
                  className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-white outline-none focus:border-os-main"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-os-main" />
                <span>Desktop Wallpaper</span>
              </h2>
              <p className="text-gray-400 mb-6 text-sm">
                Upload a custom image to replace the default animated starfield background.
              </p>

              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />
                  <div className={cn(
                    "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all",
                    isUploading ? "border-os-main/50 bg-os-main/10" : "border-white/20 hover:border-os-main hover:bg-os-main/5"
                  )}>
                    {isUploading ? (
                      <div className="animate-pulse flex flex-col items-center">
                        <UploadCloud className="w-8 h-8 text-os-main mb-2 animate-bounce" />
                        <span className="text-os-main font-medium">Uploading to Nebula Cloud...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2 group-hover:text-os-main" />
                        <span className="font-medium">Click or drag image to upload</span>
                        <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP (Max 5MB)</span>
                      </>
                    )}
                  </div>
                </div>

                {wallpaper !== '/wallpapers/default.jpg' && (
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Custom wallpaper active</span>
                    </div>
                    <button 
                      onClick={handleResetWallpaper}
                      disabled={isUploading}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* DISPLAY TAB */}
        {activeTab === 'display' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-light mb-8 flex items-center space-x-3">
              <Monitor className="text-os-main" />
              <span>Display & Appearance</span>
            </h1>

            <section className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-os-main" />
                <span>Visual Effects</span>
              </h2>
              
              <Toggle 
                label="Window Glassmorphism" 
                description="Enable backdrop-blur effects on windows. Disable for better performance."
                checked={preferences.windowGlassmorphism ?? true} 
                onChange={(c) => updatePreference('windowGlassmorphism', c)} 
              />
              <div className="border-t border-white/10" />
              <Toggle 
                label="Reduce Motion" 
                description="Disable window scaling animations for a snappier feel."
                checked={!!preferences.reduceMotion} 
                onChange={(c) => updatePreference('reduceMotion', c)} 
              />
              <div className="border-t border-white/10" />
              
              <div className="py-3">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Background Dimming</div>
                  <div className="text-os-main">{preferences.backgroundDimming ?? 0}%</div>
                </div>
                <div className="text-xs text-gray-500 mb-4">Dim the desktop background to improve text readability.</div>
                <input 
                  type="range" 
                  min="0" max="80" 
                  value={preferences.backgroundDimming ?? 0}
                  onChange={(e) => updatePreference('backgroundDimming', parseInt(e.target.value) || 0)}
                  className="w-full accent-os-main"
                />
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <MousePointer2 className="w-5 h-5 text-os-main" />
                <span>Cursor</span>
              </h2>
              <div className="py-3">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Cursor Glow Intensity</div>
                  <div className="text-os-main">{preferences.cursorGlow ?? 60}%</div>
                </div>
                <div className="text-xs text-gray-500 mb-4">Adjust the brightness of the neon drop-shadow on the cursor.</div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={preferences.cursorGlow ?? 60}
                  onChange={(e) => updatePreference('cursorGlow', parseInt(e.target.value) || 0)}
                  className="w-full accent-os-main"
                />
              </div>
            </section>
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-light mb-8 flex items-center space-x-3">
              <Cpu className="text-os-main" />
              <span>System</span>
            </h1>

            <section className="mb-10 bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-os-main" />
                <span>Top Navigation Bar</span>
              </h2>
              
              <Toggle 
                label="24-Hour Time Format" 
                description="Display the clock in 24-hour format instead of 12-hour AM/PM."
                checked={!!preferences.timeFormat24h} 
                onChange={(c) => updatePreference('timeFormat24h', c)} 
              />
              <div className="border-t border-white/10" />
              <div className="flex items-center space-x-2 py-3 text-gray-400">
                 <Battery className="w-4 h-4" />
                 <span className="flex-1 font-medium text-white">Show Battery Indicator</span>
                 <Toggle label="" checked={preferences.showBattery ?? true} onChange={(c) => updatePreference('showBattery', c)} />
              </div>
              <div className="border-t border-white/10" />
              <div className="flex items-center space-x-2 py-3 text-gray-400">
                 <Wifi className="w-4 h-4" />
                 <span className="flex-1 font-medium text-white">Show Network Indicator</span>
                 <Toggle label="" checked={preferences.showNetwork ?? true} onChange={(c) => updatePreference('showNetwork', c)} />
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5 text-os-main" />
                <span>Browser Defaults</span>
              </h2>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">Default Search Engine</div>
                  <div className="text-xs text-gray-500 mt-1">Used for searches in the Nebula Browser.</div>
                </div>
                <select 
                  value={preferences.searchEngine || 'google'}
                  onChange={(e) => updatePreference('searchEngine', e.target.value as 'google' | 'duckduckgo' | 'bing')}
                  className="bg-black/50 border border-white/10 rounded-md px-3 py-1.5 text-white outline-none focus:border-os-main"
                >
                  <option value="google">Google</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                  <option value="bing">Bing</option>
                </select>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
