import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import './App.css';

const HomePage = React.lazy(() => import('./components/Home'));
const AboutPage = React.lazy(() => import('./components/About'));
const ResumePage = React.lazy(() => import('./components/Resume'));
const ProjectsPage = React.lazy(() => import('./components/Projects'));
const BlogPage = React.lazy(() => import('./components/Blog'));


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

  React.useEffect(() => {
    const preloadRouteModules = [
      import('./components/Home'),
      import('./components/About'),
      import('./components/Resume'),
      import('./components/Projects'),
      import('./components/Blog'),
    ];

    void Promise.allSettled(preloadRouteModules);
  }, []);

  return (
    <div className="shell">
      <div className="page-frame">
        <Header currentPage={currentPage} onSetPage={(p) => setCurrentPage(p)} onHamsterClick={handleHamsterClick} />
        <div className="content-section" style={contentStyle}>
          <Routes>
            <Route path="/" element={<React.Suspense fallback={null}><HomePage setPage={() => setCurrentPage("home")} /></React.Suspense>} />
            <Route path="/about" element={<React.Suspense fallback={null}><AboutPage setPage={() => setCurrentPage("About")} /></React.Suspense>} />
            <Route path="/resume" element={<React.Suspense fallback={null}><ResumePage setPage={() => setCurrentPage("Resume")} /></React.Suspense>} />
            <Route path="/projects" element={<React.Suspense fallback={null}><ProjectsPage setPage={() => setCurrentPage("Projects")} /></React.Suspense>} />
            <Route path="/blog" element={<React.Suspense fallback={null}><BlogPage setPage={() => setCurrentPage("Blog")} /></React.Suspense>} />
            <Route path="/blog/:slug" element={<React.Suspense fallback={null}><BlogPage setPage={() => setCurrentPage("Blog")} /></React.Suspense>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
