import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Header from './components/Header';
import './App.css';


function App() {
  const [currentPage, setCurrentPage] = React.useState<string>("home");

  

  return (
    <Router>
      <div className="shell">
        <div className="page-frame">
          <Header currentPage={currentPage} onSetPage={(p) => setCurrentPage(p)} />
          <div className="content-section">
            <Routes>
              <Route path="/" element={<Home setPage={() => setCurrentPage("home")} />} />
              <Route path="/about" element={<About setPage={() => setCurrentPage("About")} />} />
              <Route path="/resume" element={<Resume setPage={() => setCurrentPage("Resume")} />} />
              <Route path="/projects" element={<Projects setPage={() => setCurrentPage("Projects")} />} />
              <Route path="/blog" element={<Blog setPage={() => setCurrentPage("Blog")} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
