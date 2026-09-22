import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CellularAutomataBackground from './components/CellularAutomataBackground';
import Header from './components/Header';
import Home from './components/Home';
import Projects from './components/Projects';
import Writing from './components/Writing';
import VoronoiBackground from './components/VoronoiBackground';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <CellularAutomataBackground />
      <VoronoiBackground />
      <div className="site-shell">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<Writing kind="project-note" />} />
          <Route path="/blog" element={<Writing kind="blog" />} />
          <Route path="/blog/:slug" element={<Writing kind="blog" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
