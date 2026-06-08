import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type OSPreferences = {
  taskbarAutoHide: boolean;
  desktopIconSize: 'small' | 'medium' | 'large';
  windowGlassmorphism: boolean;
  backgroundDimming: number; // 0 to 80
  cursorGlow: number; // 0 to 100
  reduceMotion: boolean;
  timeFormat24h: boolean;
  showBattery: boolean;
  showNetwork: boolean;
};

const defaultPreferences: OSPreferences = {
  taskbarAutoHide: false,
  desktopIconSize: 'medium',
  searchEngine: 'google',
  windowGlassmorphism: true,
  backgroundDimming: 0,
  cursorGlow: 60,
  reduceMotion: false,
  timeFormat24h: false,
  showBattery: true,
  showNetwork: true,
};

type SettingsContextType = {
  themeColor: string;
  setThemeColor: (color: string) => Promise<void>;
  wallpaper: string;
  setWallpaper: (file: File | null) => Promise<void>;
  preferences: OSPreferences;
  updatePreference: <K extends keyof OSPreferences>(key: K, value: OSPreferences[K]) => void;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState('#06b6d4'); // Default cyan-400
  const [wallpaper, setWallpaperState] = useState('/wallpapers/default.jpg');
  const [preferences, setPreferences] = useState<OSPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '6 182 212';
  };

  const applyThemeColor = (color: string) => {
    setThemeColorState(color);
    document.documentElement.style.setProperty('--os-main', hexToRgb(color));
  };

  useEffect(() => {
    // Set default immediately on mount
    document.documentElement.style.setProperty('--os-main', hexToRgb(themeColor));

    // Load Local Preferences
    const localPrefs = localStorage.getItem('nebula_preferences');
    if (localPrefs) {
      try {
        const parsed = JSON.parse(localPrefs);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse preferences', e);
      }
    }
    
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('nebula_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          if (data.theme && data.theme !== 'light') {
            applyThemeColor(data.theme);
          }
          if (data.wallpaper) {
            setWallpaperState(data.wallpaper);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();

    // Listen for login event to fetch settings
    const handleLogin = () => fetchSettings();
    window.addEventListener('nebula_login', handleLogin);
    return () => window.removeEventListener('nebula_login', handleLogin);
  }, []);

  const setThemeColor = async (color: string) => {
    applyThemeColor(color);
    try {
      const token = localStorage.getItem('nebula_token');
      if (token) {
        await fetch('http://localhost:5000/api/users/theme', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ theme: color })
        });
      }
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  const setWallpaper = async (file: File | null) => {
    try {
      const token = localStorage.getItem('nebula_token');
      if (!token) return;

      if (!file) {
        setWallpaperState('/wallpapers/default.jpg');
        return;
      }

      const formData = new FormData();
      formData.append('wallpaper', file);

      const res = await fetch('http://localhost:5000/api/users/wallpaper', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setWallpaperState(data.wallpaper);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Failed to upload wallpaper:', err);
      throw err;
    }
  };

  const updatePreference = <K extends keyof OSPreferences>(key: K, value: OSPreferences[K]) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: value };
      localStorage.setItem('nebula_preferences', JSON.stringify(newPrefs));
      return newPrefs;
    });
  };

  return (
    <SettingsContext.Provider value={{ 
      themeColor, setThemeColor, 
      wallpaper, setWallpaper, 
      preferences, updatePreference,
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
