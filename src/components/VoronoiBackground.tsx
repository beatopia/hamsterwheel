import React from 'react';

// Visibility: raise/lower this opacity to make the lines more/less noticeable.
const VORONOI_LINE_OPACITY = 0.12;
const VORONOI_LINE_COLOR = '64, 36, 25';
// Cell density: raise/lower this count for more/fewer cells.
const VORONOI_POINT_COUNT = 18;
// Line weight: raise/lower this value for thicker/thinner edges.
const VORONOI_LINE_WIDTH = 0.75;
// Motion: these control how far cells morph, how long they move, and how long they rest.
const VORONOI_MOTION_AMPLITUDE = 42;
const VORONOI_MORPH_DURATION = 3000;
const VORONOI_QUIET_DURATION = 8000;
const VORONOI_MAX_DPR = 2;
const POINT_MARGIN = 40;

type Point = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};
type Vertex = { x: number; y: number };

function clipPolygon(polygon: Vertex[], site: Point, neighbor: Point) {
  const a = 2 * (neighbor.x - site.x);
  const b = 2 * (neighbor.y - site.y);
  const c = neighbor.x ** 2 + neighbor.y ** 2 - site.x ** 2 - site.y ** 2;
  const inside = (point: Vertex) => a * point.x + b * point.y <= c;
  const result: Vertex[] = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const startInside = inside(start);
    const endInside = inside(end);

    if (startInside) result.push(start);
    if (startInside === endInside) continue;

    const denominator = a * (end.x - start.x) + b * (end.y - start.y);
    if (Math.abs(denominator) < 0.0001) continue;
    const amount = (c - a * start.x - b * start.y) / denominator;
    result.push({
      x: start.x + (end.x - start.x) * amount,
      y: start.y + (end.y - start.y) * amount,
    });
  }

  return result;
}

export default function VoronoiBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;
    const activeCanvas = canvas;
    const activeContext = context;

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let quietTimer: number | undefined;
    let animationFrame: number | undefined;
    let morphStart = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const effectsActive = () => (
      document.documentElement.dataset.theme === 'light'
      && document.documentElement.dataset.effects !== 'off'
    );

    function render() {
      activeContext.clearRect(0, 0, width, height);
      if (!effectsActive()) return;

      activeContext.strokeStyle = `rgba(${VORONOI_LINE_COLOR}, ${VORONOI_LINE_OPACITY})`;
      activeContext.lineWidth = VORONOI_LINE_WIDTH;

      for (const site of points) {
        let polygon: Vertex[] = [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: width, y: height },
          { x: 0, y: height },
        ];

        for (const neighbor of points) {
          if (neighbor === site || polygon.length === 0) continue;
          polygon = clipPolygon(polygon, site, neighbor);
        }

        if (polygon.length < 2) continue;
        activeContext.beginPath();
        activeContext.moveTo(polygon[0].x, polygon[0].y);
        for (let index = 1; index < polygon.length; index += 1) {
          activeContext.lineTo(polygon[index].x, polygon[index].y);
        }
        activeContext.closePath();
        activeContext.stroke();
      }
    }

    function createPoints() {
      const horizontalMargin = Math.min(POINT_MARGIN, width / 4);
      const verticalMargin = Math.min(POINT_MARGIN, height / 4);
      points = Array.from({ length: VORONOI_POINT_COUNT }, () => {
        const x = horizontalMargin + Math.random() * Math.max(1, width - horizontalMargin * 2);
        const y = verticalMargin + Math.random() * Math.max(1, height - verticalMargin * 2);
        return {
          x,
          y,
          startX: x,
          startY: y,
          targetX: x,
          targetY: y,
        };
      });
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, VORONOI_MAX_DPR);
      activeCanvas.width = Math.max(1, Math.round(width * dpr));
      activeCanvas.height = Math.max(1, Math.round(height * dpr));
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      createPoints();
      render();
    }

    function chooseNearbyTargets() {
      for (const point of points) {
        point.startX = point.x;
        point.startY = point.y;
        point.targetX = Math.max(0, Math.min(width, point.x + (Math.random() * 2 - 1) * VORONOI_MOTION_AMPLITUDE));
        point.targetY = Math.max(0, Math.min(height, point.y + (Math.random() * 2 - 1) * VORONOI_MOTION_AMPLITUDE));
      }
    }

    function scheduleMorph() {
      quietTimer = window.setTimeout(beginMorph, VORONOI_QUIET_DURATION);
    }

    function animateMorph(now: number) {
      const progress = Math.min(1, (now - morphStart) / VORONOI_MORPH_DURATION);
      const eased = progress * progress * (3 - 2 * progress);

      for (const point of points) {
        point.x = point.startX + (point.targetX - point.startX) * eased;
        point.y = point.startY + (point.targetY - point.startY) * eased;
      }
      render();

      if (progress < 1 && effectsActive() && document.visibilityState === 'visible') {
        animationFrame = window.requestAnimationFrame(animateMorph);
      } else {
        animationFrame = undefined;
        for (const point of points) {
          point.x = point.targetX;
          point.y = point.targetY;
        }
        render();
        if (effectsActive() && !reducedMotion.matches && document.visibilityState === 'visible') scheduleMorph();
      }
    }

    function beginMorph() {
      quietTimer = undefined;
      if (!effectsActive() || reducedMotion.matches || document.visibilityState !== 'visible') return;
      chooseNearbyTargets();
      morphStart = performance.now();
      animationFrame = window.requestAnimationFrame(animateMorph);
    }

    function stopAnimation() {
      if (quietTimer !== undefined) window.clearTimeout(quietTimer);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      quietTimer = undefined;
      animationFrame = undefined;
    }

    function syncAnimation() {
      stopAnimation();
      if (!effectsActive()) {
        activeContext.clearRect(0, 0, width, height);
        return;
      }

      render();
      if (!reducedMotion.matches && document.visibilityState === 'visible') {
        scheduleMorph();
      }
    }

    const settingsObserver = new MutationObserver(syncAnimation);
    const handleVisibility = () => syncAnimation();
    const handleResize = () => {
      resize();
      syncAnimation();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotion.addEventListener('change', syncAnimation);
    settingsObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-effects'] });

    resize();
    syncAnimation();

    return () => {
      stopAnimation();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedMotion.removeEventListener('change', syncAnimation);
      settingsObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="voronoi-background" aria-hidden="true" />;
}
