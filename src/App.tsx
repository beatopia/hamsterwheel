import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Blog from './components/Blog';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog" element={<Blog setPage={() => undefined} />} />
        <Route path="/blog/:slug" element={<Blog setPage={() => undefined} />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/projects" element={<Navigate to="/#work" replace />} />
        <Route path="/resume" element={<Navigate to="/media/images/Kai_Luzniak_Resume.pdf" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
