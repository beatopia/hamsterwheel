import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Header from './components/Header';
import './App.css';


function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = React.useState<string>("home");
  const [legsFrame, setLegsFrame] = React.useState<number>(1);
  const [bodyFrame, setBodyFrame] = React.useState<string>("/media/images/homehamster/body1.png");
  const bodyTimeoutRef = React.useRef<number | null>(null);

  const pickDifferentLegFrame = React.useCallback((currentFrame: number) => {
    let nextFrame = currentFrame;

    while (nextFrame === currentFrame) {
      nextFrame = Math.floor(Math.random() * 6) + 1;
    }

    return nextFrame;
  }, []);

  React.useEffect(() => {
    const preloadSources = [
      '/media/images/homehamster/welcome.png',
      '/media/images/homehamster/body1.png',
      '/media/images/homehamster/body2.png',
      '/media/images/homehamster/legs1.png',
      '/media/images/homehamster/legs2.png',
      '/media/images/homehamster/legs3.png',
      '/media/images/homehamster/legs4.png',
      '/media/images/homehamster/legs5.png',
      '/media/images/homehamster/legs6.png',
    ];

    const images = preloadSources.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    return () => {
      images.forEach((image) => {
        image.src = '';
      });
    };
  }, []);

  React.useEffect(() => {
    setLegsFrame((currentFrame) => pickDifferentLegFrame(currentFrame));
    const intervalId = window.setInterval(() => {
      setLegsFrame((currentFrame) => pickDifferentLegFrame(currentFrame));
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [pickDifferentLegFrame]);

  React.useEffect(() => {
    return () => {
      if (bodyTimeoutRef.current !== null) {
        window.clearTimeout(bodyTimeoutRef.current);
      }
    };
  }, []);

  const handleHamsterClick = React.useCallback(() => {
    setBodyFrame("/media/images/homehamster/body2.png");

    if (bodyTimeoutRef.current !== null) {
      window.clearTimeout(bodyTimeoutRef.current);
    }

    bodyTimeoutRef.current = window.setTimeout(() => {
      setBodyFrame("/media/images/homehamster/body1.png");
      bodyTimeoutRef.current = null;
    }, 500);
  }, []);

  const contentStyle = {
    '--welcome-image': location.pathname === '/' ? `url('/media/images/homehamster/welcome.png')` : 'none',
    '--body-image': location.pathname === '/' ? `url('${bodyFrame}')` : 'none',
    '--legs-image': location.pathname === '/' ? `url('/media/images/homehamster/legs${legsFrame}.png')` : 'none',
  } as React.CSSProperties;

  return (
    <div className="shell">
      <div className="page-frame">
        <Header currentPage={currentPage} onSetPage={(p) => setCurrentPage(p)} onHamsterClick={handleHamsterClick} />
        <div className="content-section" style={contentStyle}>
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
  );
}

export default App;
