import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalaxyPage from './pages/galaxy';
import AuthPage from './pages/auth';
import OSPage from './pages/os';
import { CursorProvider, Cursor, CursorFollow } from '@/components/animate-ui/components/animate/cursor';
import { MultiplayerCursors } from '@/components/MultiplayerCursors';
import './App.css';

function App() {
  return (
    <CursorProvider global>
      <Cursor className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
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

export default App;
