import React from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

type HobbyType = 'gaming' | 'active' | 'cooking' | 'ceramics';

interface HobbiesSectionProps {
  playEggAndNavigate: (event: React.MouseEvent, to: string) => void;
}

export default function HobbiesSection({ playEggAndNavigate }: HobbiesSectionProps) {
  const [activeHobby, setActiveHobby] = React.useState<HobbyType | null>(null);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [displayPos, setDisplayPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const triggerRefs = {
    gaming: React.useRef<HTMLSpanElement | null>(null),
    active: React.useRef<HTMLSpanElement | null>(null),
    cooking: React.useRef<HTMLSpanElement | null>(null),
    ceramics: React.useRef<HTMLSpanElement | null>(null),
  };

  React.useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouchDevice(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const updateTriggerPos = React.useCallback((hobby: HobbyType) => {
    const elem = triggerRefs[hobby].current;
    if (!elem) return;

    const rect = elem.getBoundingClientRect();
    const vw = window.innerWidth;
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top - 8;

    let targetX = centerX;
    let targetY = topY;

    if (hobby === 'gaming' || hobby === 'cooking' || hobby === 'active') {
      const cardWidth = Math.min(380, vw - 32);
      targetX = Math.max(16 + cardWidth / 2, Math.min(vw - 16 - cardWidth / 2, centerX));
      targetY = topY;
    } else if (hobby === 'ceramics') {
      const imgWidth = Math.min(510, Math.max(300, vw * 0.55));
      targetX = Math.max(16 + imgWidth / 2, Math.min(vw - 16 - imgWidth / 2, centerX));
      targetY = topY;
    }

    setDisplayPos({ x: targetX, y: targetY });
  }, []);

  const handleMouseEnter = (hobby: HobbyType) => {
    if (isTouchDevice) return;
    updateTriggerPos(hobby);
    setActiveHobby(hobby);
  };

  const handleMouseMove = (hobby: HobbyType) => {
    if (isTouchDevice) return;
    updateTriggerPos(hobby);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setActiveHobby(null);
  };

  // Touch device toggle support
  const handleTouchToggle = (hobby: HobbyType, event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (activeHobby === hobby) {
      setActiveHobby(null);
      return;
    }

    updateTriggerPos(hobby);
    setActiveHobby(hobby);
  };

  // Global dismiss on touch outside
  React.useEffect(() => {
    if (!activeHobby) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.hobby-trigger')) {
        return;
      }
      setActiveHobby(null);
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('touchstart', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [activeHobby]);

  // Keyboard accessibility
  const handleKeyDown = (hobby: HobbyType, event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (activeHobby === hobby) {
        setActiveHobby(null);
      } else {
        updateTriggerPos(hobby);
        setActiveHobby(hobby);
      }
    } else if (event.key === 'Escape') {
      setActiveHobby(null);
    }
  };

  return (
    <>
      <p className="about-copy about-inter">
        Outside of programming, I love{' '}
        <span
          ref={triggerRefs.gaming}
          className={`hobby-trigger ${activeHobby === 'gaming' ? 'hobby-trigger--active' : ''}`}
          onMouseEnter={() => handleMouseEnter('gaming')}
          onMouseMove={() => handleMouseMove('gaming')}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => isTouchDevice && handleTouchToggle('gaming', e)}
          onKeyDown={(e) => handleKeyDown('gaming', e)}
          tabIndex={0}
          role="button"
          aria-expanded={activeHobby === 'gaming'}
          aria-label="playing video games (hover to reveal favorite games)"
        >
          playing video games
        </span>
        ,{' '}
        <span
          ref={triggerRefs.active}
          className={`hobby-trigger ${activeHobby === 'active' ? 'hobby-trigger--active' : ''}`}
          onMouseEnter={() => handleMouseEnter('active')}
          onMouseMove={() => handleMouseMove('active')}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => isTouchDevice && handleTouchToggle('active', e)}
          onKeyDown={(e) => handleKeyDown('active', e)}
          tabIndex={0}
          role="button"
          aria-expanded={activeHobby === 'active'}
          aria-label="exploring nature (hover to reveal specifics)"
        >
          exploring nature
        </span>
        ,{' '}
        <span
          ref={triggerRefs.cooking}
          className={`hobby-trigger ${activeHobby === 'cooking' ? 'hobby-trigger--active' : ''}`}
          onMouseEnter={() => handleMouseEnter('cooking')}
          onMouseMove={() => handleMouseMove('cooking')}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => isTouchDevice && handleTouchToggle('cooking', e)}
          onKeyDown={(e) => handleKeyDown('cooking', e)}
          tabIndex={0}
          role="button"
          aria-expanded={activeHobby === 'cooking'}
          aria-label="cooking (hover to read note)"
        >
          cooking
        </span>
        ,{' '}
        <span
          ref={triggerRefs.ceramics}
          className={`hobby-trigger ${activeHobby === 'ceramics' ? 'hobby-trigger--active' : ''}`}
          onMouseEnter={() => handleMouseEnter('ceramics')}
          onMouseMove={() => handleMouseMove('ceramics')}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => isTouchDevice && handleTouchToggle('ceramics', e)}
          onKeyDown={(e) => handleKeyDown('ceramics', e)}
          tabIndex={0}
          role="button"
          aria-expanded={activeHobby === 'ceramics'}
          aria-label="sculpting ceramics (hover to preview Pikmin Homer sculpture)"
        >
          sculpting cursed ceramics
        </span>
        , and{' '}
        <a
          href="https://www.last.fm/user/gulped"
          target="_blank"
          rel="noopener noreferrer"
          className="hobby-music-link"
          aria-label="geeking out about music (opens Last.fm profile in new tab)"
        >
          geeking out about music
        </a>
        . For more about me, feel free to check out my{' '}
        <Link to="/blog" onClick={(event) => playEggAndNavigate(event, '/blog')}>
          blog
        </Link>
        !
      </p>

      {/* Floating Hover Content Layer */}
      {mounted &&
        createPortal(
          <div
            className={`hobby-overlay ${activeHobby ? 'hobby-overlay--active' : ''}`}
            aria-hidden="true"
          >
            {/* 1. Playing Video Games: Floating Story Card */}
            <div
              className={`hobby-content hobby-content--gaming ${activeHobby === 'gaming' ? 'is-active' : ''}`}
              style={{
                transform: `translate3d(${displayPos.x}px, ${displayPos.y}px, 0) translate(-50%, -100%)`,
              }}
            >
              <div className="hobby-gaming-card">
                <p className="hobby-gaming-text">
                  My all-time favorites include Pokemon, Minecraft (esp. modded), osu!, Overwatch, and Vermintide 2. Always open to recommendations! :)
                </p>
              </div>
            </div>

            {/* 2. Exploring Nature: Floating Story Card */}
            <div
              className={`hobby-content hobby-content--nature ${activeHobby === 'active' ? 'is-active' : ''}`}
              style={{
                transform: `translate3d(${displayPos.x}px, ${displayPos.y}px, 0) translate(-50%, -100%)`,
              }}
            >
              <div className="hobby-gaming-card">
                <p className="hobby-gaming-text">
                  I adore nature, and one of my favorite pastimes is hiking with friends!
                  My most recent hikes include Mt. Baldy, Garden of Eden, and Bridge to Nowhere.
                  I also enjoy bouldering (SLAB!!!) and top-roping. Always excited to hear about any trail recommendations!
                </p>
              </div>
            </div>

            {/* 3. Cooking: Floating Story Card */}
            <div
              className={`hobby-content hobby-content--cooking ${activeHobby === 'cooking' ? 'is-active' : ''}`}
              style={{
                transform: `translate3d(${displayPos.x}px, ${displayPos.y}px, 0) translate(-50%, -100%)`,
              }}
            >
              <div className="hobby-cooking-card">
                <p className="hobby-cooking-text">
                  NOTE: enjoying cooking != good at cooking.
                  I mostly do meal prep now, but in high school I used to try a new recipe every month. The goal is to restart that tradition this school year, as I'll finally have access to a kitchen!
                  Gone are the days of Buldak...
                </p>
              </div>
            </div>

            {/* 4. Sculpting Ceramics: Prominent Homer Sculpture Image */}
            <div
              className={`hobby-content hobby-content--ceramics ${activeHobby === 'ceramics' ? 'is-active' : ''}`}
              style={{
                transform: `translate3d(${displayPos.x}px, ${displayPos.y}px, 0) translate(-50%, -100%)`,
              }}
            >
              <div className="hobby-ceramics-wrap">
                <img
                  src="/media/images/about/pikminhomer.jpg"
                  alt="Pikmin Homer ceramic sculpture"
                  className="hobby-ceramics-img"
                  loading="eager"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
