import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicBackground from './components/CosmicBackground';
import ArtifactGallery from './components/ArtifactGallery';
import ImageGallery from './components/ImageGallery';
import { Menu, X } from 'lucide-react';
import MorphingO from './components/MorphingO';
import MorphingMoneySS from './components/MorphingMoneySS';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [activeSection, setActiveSection] = useState<'home' | 'proof' | 'playground' | 'about'>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Hero text animation sequence (seconds)
  const HERO_SEQ = useMemo(
    () => ({
      ballDelay: 0.15,
      ampDelay: 1.15,
      moneyDelay: 1.85,
    }),
    []
  );

  const horizontalWrapRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const productQuoteRef = useRef<HTMLElement>(null);
  const lifeQuoteRef = useRef<HTMLElement>(null);
  
  const secondPageRef = useRef<HTMLDivElement>(null);
  const thirdPageRef = useRef<HTMLDivElement>(null);
  const fourthPageRef = useRef<HTMLDivElement>(null);
  const heroRowRef = useRef<HTMLDivElement>(null);
  const heroNavPillRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroAmpRef = useRef<HTMLSpanElement>(null);
  const heroNameTextRef = useRef<HTMLDivElement>(null);
  const arrowPathRef = useRef<SVGPathElement>(null);
  const arrowSvgRef = useRef<SVGSVGElement>(null);
  const arrowheadPathRef = useRef<SVGPathElement>(null);
  const heroAlphaRef = useRef<{
    naturalW: number;
    naturalH: number;
    bbox: { minX: number; minY: number; maxX: number; maxY: number; w: number; h: number };
  } | null>(null);

  const applyHeroSubjectCentering = useCallback(() => {
    const row = heroRowRef.current;
    const img = heroImgRef.current;
    const alpha = heroAlphaRef.current;

    if (!img) return;

    const isMdUp = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 768px)').matches;
    if (!isMdUp) {
      img.style.transform = '';
      return;
    }

    if (!row || !alpha) return;

    // Make the computation stable by measuring from the "untransformed" image position.
    img.style.transform = '';
    const rowRect = row.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const bboxCenterX = (alpha.bbox.minX + alpha.bbox.maxX) / 2;
    const scaleX = imgRect.width / alpha.naturalW;
    const targetX = rowRect.left + rowRect.width * 0.75 + 24; // slight bias into the right half
    const currentSubjectCenterX = imgRect.left + bboxCenterX * scaleX;
    const translateXPx = Math.round(targetX - currentSubjectCenterX);

    img.style.transform = `translateX(${translateXPx}px)`;
  }, []);

  useLayoutEffect(() => {
    applyHeroSubjectCentering();

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            applyHeroSubjectCentering();
          })
        : null;

    if (ro && heroRowRef.current) ro.observe(heroRowRef.current);
    if (ro && heroImgRef.current) ro.observe(heroImgRef.current);

    window.addEventListener('resize', applyHeroSubjectCentering);
    return () => {
      window.removeEventListener('resize', applyHeroSubjectCentering);
      ro?.disconnect();
    };
  }, [applyHeroSubjectCentering]);

  // Update arrow path based on text and image positions
  // Adjustable parameters for fine-tuning arrow position
  const arrowConfig = {
    // Start point offsets (relative to text center): 0 = center, -50 = left edge, 50 = right edge
    startOffsetX: 0, // Horizontal offset from text center
    startOffsetY: 45, // Vertical offset from text center (positive = down, to bottom of text)
    // End point offsets (relative to image): 0 = center, -50 = left edge, 50 = right edge
    endOffsetX: 3, // Horizontal offset from image center (positive = right side, pointing to chest)
    endOffsetY: 7, // Vertical offset from image center (positive = down, pointing to chest)
    // Curve control point adjustment
    curveOffsetY: 12, // How much the curve dips down
  };

  const updateArrowPath = useCallback(() => {
    const textEl = heroNameTextRef.current;
    const imgEl = heroImgRef.current;
    const pathEl = arrowPathRef.current;
    const section = heroRowRef.current?.closest('section');

    if (!textEl || !imgEl || !pathEl || !section) return;

    const isMdUp = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 768px)').matches;
    if (!isMdUp) return;

    const sectionRect = section.getBoundingClientRect();
    const textRect = textEl.getBoundingClientRect();
    const imgRect = imgEl.getBoundingClientRect();

    // Calculate start position (text center + offsets)
    const startX = ((textRect.left + textRect.width / 2 + (textRect.width * arrowConfig.startOffsetX / 100)) - sectionRect.left) / sectionRect.width * 100;
    const startY = ((textRect.top + textRect.height / 2 + (textRect.height * arrowConfig.startOffsetY / 100)) - sectionRect.top) / sectionRect.height * 100;
    
    // Calculate end position (image center + offsets)
    const endX = ((imgRect.left + imgRect.width / 2 + (imgRect.width * arrowConfig.endOffsetX / 100)) - sectionRect.left) / sectionRect.width * 100;
    const endY = ((imgRect.top + imgRect.height / 2 + (imgRect.height * arrowConfig.endOffsetY / 100)) - sectionRect.top) / sectionRect.height * 100;

    // Curved path with visible curve
    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 + 8; // More pronounced curve downward
    pathEl.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`);
  }, []);

  useEffect(() => {
    updateArrowPath();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          updateArrowPath();
        })
      : null;

    if (ro && heroRowRef.current) ro.observe(heroRowRef.current);
    if (ro && heroNameTextRef.current) ro.observe(heroNameTextRef.current);
    if (ro && heroImgRef.current) ro.observe(heroImgRef.current);

    window.addEventListener('resize', updateArrowPath);
    return () => {
      window.removeEventListener('resize', updateArrowPath);
      ro?.disconnect();
    };
  }, [updateArrowPath]);

  // Scroll-triggered animations for text and arrow
  useEffect(() => {
    const textEl = heroNameTextRef.current;
    const pathEl = arrowPathRef.current;
    const section = heroRowRef.current?.closest('section');
    const svgEl = arrowSvgRef.current;

    if (!textEl || !pathEl || !section) return;

    const isMdUp = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 768px)').matches;
    if (!isMdUp) return;

    // Hide SVG immediately to prevent any flash (using visibility for more reliable hiding)
    if (svgEl) {
      gsap.set(svgEl, { visibility: 'hidden' });
    }
    // Initially hide text and arrow
    gsap.set(textEl, { opacity: 0 });
    
    // Ensure path is updated before trying to hide it
    updateArrowPath();
    
    // Hide arrow path immediately and set strokeDashoffset to hide the path
    const initialPathLength = pathEl.getTotalLength();
    if (initialPathLength > 0 && !isNaN(initialPathLength)) {
      // Path is ready, hide it immediately with stroke dash
      gsap.set(pathEl, { 
        opacity: 0,
        strokeDasharray: initialPathLength,
        strokeDashoffset: initialPathLength 
      });
    } else {
      // Path not ready yet, just hide opacity
      gsap.set(pathEl, { opacity: 0 });
    }
    const arrowheadPath = arrowheadPathRef.current;
    if (arrowheadPath) {
      gsap.set(arrowheadPath, { opacity: 0 });
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:173',message:'Initial hide state',data:{svgOpacity:svgEl?gsap.getProperty(svgEl,'opacity'):null,textElOpacity:gsap.getProperty(textEl,'opacity'),pathElOpacity:gsap.getProperty(pathEl,'opacity'),pathLength:initialPathLength,arrowheadOpacity:arrowheadPath?gsap.getProperty(arrowheadPath,'opacity'):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Wait for path to be calculated, then set up stroke animation
    const setupPathAnimation = () => {
      const pathLength = pathEl.getTotalLength();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:182',message:'Path length check',data:{pathLength,pathElVisible:pathEl.style.opacity||'auto'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      if (pathLength === 0 || isNaN(pathLength)) {
        // Path not ready yet, try again
        setTimeout(setupPathAnimation, 100);
        return;
      }

      // Keep SVG hidden until scroll starts - path will be shown when animation begins
      // Don't show SVG here, it will be shown when scroll animation starts
      gsap.set(pathEl, { 
        opacity: 1,
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength 
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:194',message:'Path setup complete',data:{svgOpacity:svgEl?gsap.getProperty(svgEl,'opacity'):null,pathElOpacity:gsap.getProperty(pathEl,'opacity'),strokeDasharray:pathEl.style.strokeDasharray,strokeDashoffset:pathEl.style.strokeDashoffset},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      // Set up text for animation
      const text = textEl.textContent || '';
      textEl.textContent = '';
      textEl.style.opacity = '1';
      
      const chars = text.split('');
      chars.forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        textEl.appendChild(span);
      });

      // Create timeline for text and arrow animation
      const tl = gsap.timeline({ paused: true });

      // Animate text character by character (slower)
      const textSpans = textEl.querySelectorAll('span');
      textSpans.forEach((span, i) => {
        tl.to(span, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out'
        }, i * 0.08); // Slower character reveal
      });

      // Animate arrow path drawing (slower)
      tl.to(pathEl, {
        strokeDashoffset: 0,
        duration: 2.5, // Slower arrow drawing
        ease: 'power2.out'
      }, 0.5); // Start after text begins

      // Show arrowhead when arrow is almost complete
      if (arrowheadPath) {
        tl.to(arrowheadPath, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.5'); // Start slightly before arrow completes
      }

      // Use the horizontal wrap to calculate scroll position
      const horizontalWrap = horizontalWrapRef.current;
      
      // Force timeline to start at 0 progress initially
      tl.progress(0);
      
      // Use a scroll event listener to manually control timeline progress
      // This is more reliable than ScrollTrigger for pinned containers
      const scrollRange = 400; // Animation completes over 400px of scroll
      const startScrollOffset = 50; // Start animation after 50px of scroll
      
      // Get the scroll position of the horizontal wrap when it first appears
      const getWrapScrollPosition = () => {
        if (!horizontalWrap) return 0;
        const wrapRect = horizontalWrap.getBoundingClientRect();
        return wrapRect.top + window.scrollY;
      };
      
      const wrapStartScrollY = getWrapScrollPosition();
      
      const handleScroll = () => {
        const currentScroll = window.scrollY;
        // Calculate scroll relative to when the wrap section starts
        const scrollDelta = currentScroll - wrapStartScrollY;
        
        if (scrollDelta < startScrollOffset) {
          // Before start threshold, keep at 0 and hide SVG
          if (tl.progress() > 0) {
            tl.progress(0);
          }
          const svgEl = arrowSvgRef.current;
          if (svgEl) {
            gsap.set(svgEl, { visibility: 'hidden' });
          }
        } else {
          // Show SVG when scroll animation starts
          const svgEl = arrowSvgRef.current;
          if (svgEl) {
            gsap.set(svgEl, { visibility: 'visible' });
          }
          // Calculate progress based on scroll distance
          const effectiveScroll = scrollDelta - startScrollOffset;
          const maxScroll = scrollRange - startScrollOffset;
          const progress = Math.min(1, Math.max(0, effectiveScroll / maxScroll));
          tl.progress(progress);
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial call to set correct state
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };

    let cleanup: (() => void) | undefined;
    const timeoutId = setTimeout(() => {
      cleanup = setupPathAnimation();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, [updateArrowPath]);

  // Artifact data
  const productDesignArtifacts = [
    { name: 'PetInsurance - Product Design.pdf', path: '/Artefacts/Product Design/PetInsurance - Product Design.pdf' },
    { name: 'Bliss_Partner_Product.pdf', path: '/Artefacts/Product Design/Bliss_Partner_Product.pdf' },
    { name: 'Upwise.ai.pdf', path: '/Artefacts/Product Design/prodblitz.pdf' },
    { name: 'Rapido.pdf', path: '/Artefacts/Product Design/Rapido.pdf' },
  ];

  const prdArtifacts = [
    { name: 'BMS PRD.pdf', path: '/Artefacts/PRD/BMS PRD.pdf' }
  ];

  const productTeardownsArtifacts = [
    { name: 'Inshots Product Breakdown.pdf', path: '/Artefacts/Product Teardowns/Inshots Product Breakdown.pdf' },
    { name: 'The Souled Store Product Breakdown.pdf', path: '/Artefacts/Product Teardowns/The Souled Store Product Breakdown.pdf' }
  ];

  const vibeCodedImages = [
    '/Image1.png',
    '/Image2.png'
  ];

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Vojaswwin_Product_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = useMemo(
    () =>
      [
        { id: 'home', label: 'Home' },
        { id: 'proof', label: 'Proof of Work' },
        { id: 'playground', label: 'Playground' },
        { id: 'about', label: 'About' },
      ] as const,
    []
  );

  const scrollToSection = (id: string) => {
    // Desktop-only: Home -> Proof is a horizontal pinned scroll region.
    const isMdUp =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 768px)').matches;
    if (isMdUp && (id === 'home' || id === 'proof')) {
      const wrap = horizontalWrapRef.current;
      if (wrap) {
        const top = wrap.getBoundingClientRect().top + window.scrollY;
        const horizontalScrollDistance = window.innerWidth; // matches ScrollTrigger end distance
        const targetY = id === 'proof' ? top + horizontalScrollDistance : top;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
        setMobileNavOpen(false);
        return;
      }
    }

    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setPageHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Intentionally blank: scroll position no longer needed for hero animations.
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero menu intro animation: expand from center on load
  useEffect(() => {
    const el = heroNavPillRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out', transformOrigin: '50% 50%' }
    );
  }, []);

  // Hero "&" flip animation on load: two horizontal flips and settle
  useEffect(() => {
    const el = heroAmpRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const tl = gsap.timeline({ delay: HERO_SEQ.ampDelay });
    tl.set(el, { transformPerspective: 800, transformOrigin: '50% 50%', force3D: true })
      .fromTo(el, { rotationY: 0 }, { rotationY: 720, duration: 1.15, ease: 'power2.inOut' })
      .to(el, { scale: 1.08, duration: 0.12, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.18, ease: 'power2.out' });

    return () => {
      tl.kill();
    };
  }, [HERO_SEQ.ampDelay]);

  // Track the currently viewed section to highlight the menu item
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the entry with the highest intersection ratio
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        const id = best?.target?.id as typeof activeSection | undefined;
        if (id) setActiveSection(id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: '-25% 0px -55% 0px',
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navItems]);

  // GSAP animations on mount
  useLayoutEffect(() => {
    const wrap = horizontalWrapRef.current;
    const track = horizontalTrackRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: horizontal pinned slide (Home -> Proof)
      mm.add('(min-width: 768px)', () => {
        if (!wrap || !track) return;

        gsap.set(track, { x: 0 });

        const tween = gsap.to(track, {
          x: () => -window.innerWidth,
          ease: 'none',
        });

        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: () => `+=${window.innerWidth}`,
          pin: true,
          scrub: true,
          animation: tween,
          invalidateOnRefresh: true,
        });

        // Proof is revealed horizontally on desktop, so ensure it's visible immediately.
        if (secondPageRef.current) gsap.set(secondPageRef.current, { opacity: 1 });

        return () => {
          tween.kill();
        };
      });

      // Mobile: keep the existing fade-in behavior for Proof
      mm.add('(max-width: 767px)', () => {
        if (secondPageRef.current) {
          gsap.set(secondPageRef.current, { opacity: 0 });
          ScrollTrigger.create({
            trigger: secondPageRef.current,
            start: 'top 80%',
            end: 'top 50%',
            onEnter: () => {
              gsap.to(secondPageRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
            },
          });
        }
      });

      // Third page fade-in (all sizes; still vertical)
      if (thirdPageRef.current) {
        ScrollTrigger.create({
          trigger: thirdPageRef.current,
          start: 'top 80%',
          end: 'top 50%',
          onEnter: () => {
            gsap.to(thirdPageRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          },
        });
      }

      // Fourth page fade-in (all sizes; still vertical)
      if (fourthPageRef.current) {
        ScrollTrigger.create({
          trigger: fourthPageRef.current,
          start: 'top 80%',
          end: 'top 50%',
          onEnter: () => {
            gsap.to(fourthPageRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          },
        });
      }

      // Quote intro animations
      const quoteEnter = (el: HTMLElement) => {
        const reduceMotion =
          typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
          gsap.set(el, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        gsap.set(el, { opacity: 0, y: 22, scale: 0.985 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: 'power3.out',
              clearProps: 'transform',
            });
          },
        });
      };

      if (productQuoteRef.current) quoteEnter(productQuoteRef.current);
      if (lifeQuoteRef.current) quoteEnter(lifeQuoteRef.current);

      return () => mm.revert();
    });

    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [pageHeight]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: '#FFF7E6' }}>
      <CosmicBackground />

      {/* Hero Menu (kept outside the horizontally-transformed track so it stays centered on the first screen) */}
      <nav
        aria-label="Primary"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[92vw]"
      >
        <div
          ref={heroNavPillRef}
          className="flex items-center justify-center gap-3 max-w-[92vw] rounded-full border border-black/10 bg-[#FFF7E6]/70 backdrop-blur px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] will-change-transform"
        >
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={[
                    'px-3 py-2 rounded-full text-sm font-bold transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30',
                    isActive ? 'bg-black text-[#FFF7E6]' : 'text-black hover:bg-black/5',
                  ].join(' ')}
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleResumeDownload}
              className="ml-1 px-3 py-2 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Resume
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={handleResumeDownload}
              className="px-3 py-2 rounded-full text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Resume
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="p-2 rounded-full text-black hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="mt-2 rounded-2xl border border-black/10 bg-[#FFF7E6]/90 backdrop-blur px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:hidden">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={[
                    'w-full text-left px-4 py-3 rounded-xl text-base font-bold transition-colors',
                    isActive ? 'bg-black text-[#FFF7E6]' : 'text-black hover:bg-black/5',
                  ].join(' ')}
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>
      
      {/* Horizontal region: Home -> Proof (desktop only). Mobile stays vertical stack. */}
      <div ref={horizontalWrapRef} className="relative z-10 w-full md:overflow-hidden">
        <div ref={horizontalTrackRef} className="flex flex-col md:flex-row md:w-[200vw]">
          {/* First Page - Homepage */}
          <section id="home" className="relative h-[100svh] w-full md:w-screen flex items-stretch px-4 sm:px-8 md:px-16 lg:px-24 py-0 scroll-mt-28">
        <div ref={heroRowRef} className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-12 h-full">
          {/* Left Side - Text */}
          <div className="w-full md:flex-1 md:h-full flex flex-col justify-center md:justify-center items-start md:translate-x-4 lg:translate-x-6">
            <h1
              className="font-league font-black tracking-tight leading-[0.9] text-black select-none text-left w-full flex flex-col gap-[clamp(0.25rem,1.2vmin,1.1rem)]"
              style={{ fontSize: 'clamp(3.25rem, 22vmin, 80vmin)' }}
            >
              <span className="block">
                <span className="inline-flex items-baseline whitespace-nowrap">
                  Pr<MorphingO delay={HERO_SEQ.ballDelay} />
                  <span className="inline-block -ml-[0.05em]">duct,</span>
                </span>
              </span>
              <span className="block">
                <span className="inline-flex items-baseline whitespace-nowrap">
                  Busine<span className="inline-block -ml-[0.06em]"><MorphingMoneySS moneyColor="#16a34a" delay={HERO_SEQ.moneyDelay} /></span>
                </span>
              </span>
              <span className="block">
                <span ref={heroAmpRef} className="inline-block text-red-600 will-change-transform">
                  &amp;
                </span>
                {' '}
                <span className="inline-block -ml-[0.06em] text-black">Tech.</span>
              </span>
            </h1>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:flex-1 md:h-full flex justify-center md:justify-start items-end md:-translate-x-10 lg:-translate-x-14 xl:-translate-x-16">
            <div className="relative">
              <img
                ref={heroImgRef}
                src="/HeroSectionImage.png"
                alt="Portrait"
                className="block h-[82svh] lg:h-[86svh] xl:h-[88svh] w-auto max-w-[92vw] md:max-w-none object-contain select-none pointer-events-none"
                draggable={false}
                onLoad={() => {
                  const img = heroImgRef.current;
                  try {
                    if (!img || !img.naturalWidth || !img.naturalHeight) return;

                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) return;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const w = canvas.width;
                    const h = canvas.height;
                    const alphaThreshold = 8; // 0..255 (ignore near-transparent pixels)

                    let minX = w,
                      minY = h,
                      maxX = -1,
                      maxY = -1;
                    for (let y = 0; y < h; y++) {
                      const row = y * w * 4;
                      for (let x = 0; x < w; x++) {
                        const a = data[row + x * 4 + 3];
                        if (a > alphaThreshold) {
                          if (x < minX) minX = x;
                          if (y < minY) minY = y;
                          if (x > maxX) maxX = x;
                          if (y > maxY) maxY = y;
                        }
                      }
                    }

                    const hasOpaque = maxX >= 0 && maxY >= 0 && minX < w && minY < h;
                    if (!hasOpaque) {
                      heroAlphaRef.current = null;
                      return;
                    }

                    heroAlphaRef.current = {
                      naturalW: w,
                      naturalH: h,
                      bbox: { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 },
                    };
                  } finally {
                    applyHeroSubjectCentering();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Name overlay (desktop+): centered in the right half of the viewport */}
        <div
          ref={heroNameTextRef}
          className="hidden md:block absolute top-[33%] left-[84%] lg:left-[86%] xl:left-[88%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none whitespace-nowrap text-red-600 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] font-caveat"
          style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(2.25rem, 3.6vw, 4rem)' }}
        >
          Vojaswwin A P
        </div>

        {/* Curved arrow pointing from text to hero image (desktop+) */}
        <svg
          ref={arrowSvgRef}
          className="hidden md:block absolute inset-0 w-full h-full z-19 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible', visibility: 'hidden' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="4"
              markerHeight="4"
              refX="3"
              refY="1.5"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path
                ref={arrowheadPathRef}
                d="M 0 0 L 3 1.5 L 0 3"
                fill="none"
                stroke="#0891b2"
                strokeWidth="0.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>
          {/* Straight arrow path: dynamically calculated from text to image */}
          <path
            ref={arrowPathRef}
            d=""
            stroke="#0891b2"
            strokeWidth="0.4"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      </section>

      {/* Second Page - Proof of Work */}
      <section
        id="proof"
        className="relative w-full md:w-screen min-h-screen flex flex-col items-center justify-start px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 scroll-mt-28"
        style={{ background: 'transparent' }}
      >
        <div ref={secondPageRef} className="w-full max-w-7xl opacity-0">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-12 md:mb-16 text-center"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Proof of Work
          </h2>

          {/* Back to vertical flow like before */}
          <div className="space-y-16 md:space-y-20">
            <ArtifactGallery title="Product Design" artifacts={productDesignArtifacts} />
            <ArtifactGallery title="PRD" artifacts={prdArtifacts} />
            <ArtifactGallery title="Product Teardowns" artifacts={productTeardownsArtifacts} />
          </div>

          <div className="mt-16 md:mt-20 text-center">
            <button
              onClick={handleResumeDownload}
              className="text-xl md:text-2xl font-bold text-black hover:underline transition-all"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              Download Resume
            </button>
          </div>
        </div>
      </section>
        </div>
      </div>

      {/* Third Page - Vibe Coders Playground */}
      <section
        aria-label="Product quote"
        ref={productQuoteRef}
        className="relative w-full z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-10 md:py-14"
        style={{ background: 'transparent' }}
      >
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur-md px-6 py-10 md:px-12 md:py-14 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            {/* subtle accent */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-black/15 to-transparent" />

            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                <span className="h-[1px] w-20 bg-black/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
              </div>

              <p
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-snug tracking-tight"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                <span className="inline-block align-top text-black/25 mr-2">“</span>
                Great product work is clarity: a crisp problem, a simple solution, and feedback loops that never stop.
                <span className="inline-block align-top text-black/25 ml-2">”</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="playground" className="relative min-h-screen w-full flex flex-col items-center justify-start z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-20 scroll-mt-28" style={{ background: 'transparent' }}>
        <div 
          ref={thirdPageRef}
          className="w-full max-w-7xl opacity-0"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-12 md:mb-16 text-center"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Vibe Coders Playground
          </h2>
          
          <ImageGallery images={vibeCodedImages} />
        </div>
      </section>

      {/* Fourth Page - About Me */}
      <section
        aria-label="Life quote"
        ref={lifeQuoteRef}
        className="relative w-full z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-10 md:py-14"
        style={{ background: 'transparent' }}
      >
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur-md px-6 py-10 md:px-12 md:py-14 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-black/15 to-transparent" />

            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                <span className="h-[1px] w-20 bg-black/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
              </div>

              <p
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-snug tracking-tight"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                <span className="inline-block align-top text-black/25 mr-2">“</span>
                Stay curious, do the hard thinking, and ship with empathy.
                <span className="inline-block align-top text-black/25 ml-2">”</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative min-h-screen w-full flex flex-col items-center justify-start z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-20 scroll-mt-28" style={{ background: 'transparent' }}>
        <div 
          ref={fourthPageRef}
          className="w-full max-w-4xl opacity-0"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-12 md:mb-16 text-center"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            About Me
          </h2>
          
          <div className="space-y-6 md:space-y-8 text-lg md:text-xl lg:text-2xl text-black leading-relaxed">
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              I am Vojaswwin A P. I like building products that feel simple on the outside and are thoughtfully engineered on the inside.
              I’m doing a PGP in Technology &amp; Business Management at Masters’ Union, and I bring 4 years of experience from Thoughtworks.
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              I’ve led release cycles (about every 6 sprints), partnered with PMs and engineers, and kept quality high through crisp testing strategy.
              I also love talking to users and stress-testing flows, including validating 100+ journeys that helped lift checkout conversion.
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              I’m happiest when I can ship and improve the engine room, too. I’ve built automation that cut manual effort by ~30%,
              improved reliability in production, and reduced cloud costs by ~75% by smarter test runs.
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              When I’m not working, I’m doing product teardowns, vibe-coding tiny experiments, or building scrappy projects (like a Shopify store with 250+ SKUs).
              I’m big on curiosity, clean craft, and shipping with empathy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
