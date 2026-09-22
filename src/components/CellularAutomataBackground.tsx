import React from 'react';

const CELL_SIZE = 20;
const UPDATE_INTERVAL = 250;
const CELL_OPACITY = 0.014;
const INITIAL_DENSITY = 0.12;
const CELL_COLOR = '226, 232, 240';
const MAX_DPR = 2;

function seedPatterns(grid: Uint8Array, columns: number, rows: number) {
  const setCell = (x: number, y: number) => {
    if (x >= 0 && x < columns && y >= 0 && y < rows) grid[y * columns + x] = 1;
  };

  for (let seed = 0; seed < 8; seed += 1) {
    const centerX = Math.floor(((seed + 1) / 9) * columns);
    const centerY = Math.floor((((seed * 5) % 8) + 1) / 9 * rows);
    setCell(centerX - 1, centerY);
    setCell(centerX, centerY);
    setCell(centerX + 1, centerY);
  }
}

export default function CellularAutomataBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;
    const activeCanvas = canvas;
    const activeContext = context;

    let columns = 0;
    let rows = 0;
    let grid = new Uint8Array();
    let nextGrid = new Uint8Array();
    let timer: number | undefined;
    let renderFrame: number | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function render() {
      activeContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (document.documentElement.dataset.theme !== 'dark' || document.documentElement.dataset.effects === 'off') return;

      const drawGrid = (opacity: number) => {
        activeContext.fillStyle = `rgba(${CELL_COLOR}, ${opacity})`;
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < columns; x += 1) {
            if (grid[y * columns + x]) activeContext.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      };

      drawGrid(CELL_OPACITY);
    }

    function requestRender() {
      if (renderFrame !== undefined) return;
      renderFrame = window.requestAnimationFrame(() => {
        renderFrame = undefined;
        render();
      });
    }

    function initialize() {
      grid.fill(0);
      for (let index = 0; index < grid.length; index += 1) {
        if (Math.random() < INITIAL_DENSITY) grid[index] = 1;
      }
      seedPatterns(grid, columns, rows);
      render();
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      activeCanvas.width = Math.max(1, Math.round(width * dpr));
      activeCanvas.height = Math.max(1, Math.round(height * dpr));
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.max(1, Math.ceil(width / CELL_SIZE));
      rows = Math.max(1, Math.ceil(height / CELL_SIZE));
      grid = new Uint8Array(columns * rows);
      nextGrid = new Uint8Array(columns * rows);
      initialize();
    }

    function step() {
      nextGrid.fill(0);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          let neighbors = 0;
          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              if (offsetX === 0 && offsetY === 0) continue;
              const neighborX = x + offsetX;
              const neighborY = y + offsetY;
              if (neighborX >= 0 && neighborX < columns && neighborY >= 0 && neighborY < rows) {
                neighbors += grid[neighborY * columns + neighborX];
              }
            }
          }
          const index = y * columns + x;
          nextGrid[index] = neighbors === 3 || (grid[index] === 1 && neighbors === 2) ? 1 : 0;
        }
      }
      [grid, nextGrid] = [nextGrid, grid];
      render();
    }

    function syncAnimation() {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      const effectsActive = document.documentElement.dataset.theme === 'dark' && document.documentElement.dataset.effects !== 'off';
      if (!effectsActive) {
        activeContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
        return;
      }
      render();
      if (!reducedMotion.matches && document.visibilityState === 'visible') {
        timer = window.setInterval(step, UPDATE_INTERVAL);
      }
    }

    function editCell(event: PointerEvent, value: 0 | 1) {
      if (document.documentElement.dataset.theme !== 'dark' || document.documentElement.dataset.effects === 'off') return;
      const x = Math.floor(event.clientX / CELL_SIZE);
      const y = Math.floor(event.clientY / CELL_SIZE);
      if (x < 0 || x >= columns || y < 0 || y >= rows) return;

      grid[y * columns + x] = value;
      requestRender();
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button === 0) editCell(event, 1);
      if (event.button === 2) editCell(event, 0);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.buttons & 2) editCell(event, 0);
      else if (event.buttons & 1) editCell(event, 1);
    }

    function handleContextMenu(event: MouseEvent) {
      if (document.documentElement.dataset.theme === 'dark' && document.documentElement.dataset.effects !== 'off') event.preventDefault();
    }

    const themeObserver = new MutationObserver(syncAnimation);
    const handleVisibility = () => syncAnimation();
    const handleResize = () => {
      resize();
      syncAnimation();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotion.addEventListener('change', syncAnimation);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-effects'] });

    resize();
    syncAnimation();

    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      if (renderFrame !== undefined) window.cancelAnimationFrame(renderFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedMotion.removeEventListener('change', syncAnimation);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="cellular-automata" aria-hidden="true" />;
}
