import { useState } from 'react';
import { useSettings } from '@/lib/SettingsContext';
import { cn } from '@/lib/utils';
import { Paintbrush, Image as ImageIcon, RotateCcw, Monitor, CheckCircle2, UploadCloud } from 'lucide-react';

export function SettingsApp() {
  const { themeColor, setThemeColor, wallpaper, setWallpaper } = useSettings();
  const [activeTab, setActiveTab] = useState<'personalization' | 'display'>('personalization');
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
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

        {activeTab === 'display' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-light mb-8 flex items-center space-x-3">
              <Monitor className="text-os-main" />
              <span>Display Settings</span>
            </h1>
            <section className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center py-20 text-center">
               <Monitor className="w-16 h-16 text-gray-600 mb-4" />
               <h3 className="text-lg font-medium text-gray-300">Additional settings coming soon</h3>
               <p className="text-sm text-gray-500 mt-2 max-w-md">
                 Future updates will include display scaling, brightness, resolution overrides, and multi-monitor setup for NebulaOS.
               </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
