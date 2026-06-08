import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalaxyPage from './pages/galaxy';
import AuthPage from './pages/auth';
import OSPage from './pages/os';
import { CursorProvider, Cursor, CursorFollow } from '@/components/animate-ui/components/animate/cursor';
import { MultiplayerCursors } from '@/components/MultiplayerCursors';
import { SettingsProvider, useSettings } from '@/lib/SettingsContext';
import './App.css';

function InnerApp() {
  const { preferences } = useSettings();
  
  return (
    <CursorProvider global>
      <Cursor 
        className="text-os-main" 
        style={{ 
          filter: `drop-shadow(0 0 ${8 * (preferences.cursorGlow / 100)}px rgb(var(--os-main) / ${preferences.cursorGlow / 100}))` 
        }} 
      />
      <CursorFollow className="bg-[#0a0514]/80 text-fuchsia-400 border border-fuchsia-500/30 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(217,70,239,0.2)]">
        ME
      </CursorFollow>
      <MultiplayerCursors />
      <Router>
        <Routes>
          <Route path="/" element={<GalaxyPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/os" element={<OSPage />} />
        </Routes>
      </Router>
    </CursorProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <InnerApp />
    </SettingsProvider>
  );
}

export default App;
