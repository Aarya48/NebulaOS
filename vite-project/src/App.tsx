import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalaxyPage from './pages/galaxy';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalaxyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
