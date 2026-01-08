import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicBackground from './components/CosmicBackground';
import ArtifactGallery from './components/ArtifactGallery';
import ImageGallery from './components/ImageGallery';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [activeSection, setActiveSection] = useState<'home' | 'proof' | 'playground' | 'about'>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const secondPageRef = useRef<HTMLDivElement>(null);
  const thirdPageRef = useRef<HTMLDivElement>(null);
  const fourthPageRef = useRef<HTMLDivElement>(null);
  const heroRowRef = useRef<HTMLDivElement>(null);
  const heroNavPillRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroAmpRef = useRef<HTMLSpanElement>(null);
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

    const tl = gsap.timeline();
    tl.set(el, { transformPerspective: 800, transformOrigin: '50% 50%', force3D: true })
      .fromTo(el, { rotationY: 0 }, { rotationY: 720, duration: 1.15, ease: 'power2.inOut' })
      .to(el, { scale: 1.08, duration: 0.12, ease: 'power2.out' })
      .to(el, { scale: 1, duration: 0.18, ease: 'power2.out' });

    return () => {
      tl.kill();
    };
  }, []);

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
  useEffect(() => {
    // Animate second page content
    if (secondPageRef.current) {
      ScrollTrigger.create({
        trigger: secondPageRef.current,
        start: "top 80%",
        end: "top 50%",
        onEnter: () => {
          gsap.to(secondPageRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    }

    // Animate third page content
    if (thirdPageRef.current) {
      ScrollTrigger.create({
        trigger: thirdPageRef.current,
        start: "top 80%",
        end: "top 50%",
        onEnter: () => {
          gsap.to(thirdPageRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    }

    // Animate fourth page content
    if (fourthPageRef.current) {
      ScrollTrigger.create({
        trigger: fourthPageRef.current,
        start: "top 80%",
        end: "top 50%",
        onEnter: () => {
          gsap.to(fourthPageRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [pageHeight]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: '#FFF7E6' }}>
      <CosmicBackground />
      
      {/* First Page - Homepage */}
      <section id="home" className="relative h-[100svh] w-full flex items-stretch px-4 sm:px-8 md:px-16 lg:px-24 py-0 z-10 scroll-mt-28">
        {/* Hero Menu */}
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

        <div ref={heroRowRef} className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-12 h-full">
          {/* Left Side - Text */}
          <div className="w-full md:flex-1 md:h-full flex flex-col justify-center md:justify-center items-start md:translate-x-4 lg:translate-x-6">
            <h1
              className="font-league font-black tracking-tight leading-[0.85] text-black select-none text-left"
              style={{ fontSize: 'clamp(3.25rem, 22vmin, 80vmin)' }}
            >
              <span className="block">Product,</span>
              <span className="block">Design</span>
              <span className="block">
                <span ref={heroAmpRef} className="inline-block text-red-600 will-change-transform">
                  &amp;
                </span>
                {' '}
                <span className="text-black">Tech.</span>
              </span>
            </h1>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:flex-1 md:h-full flex justify-center md:justify-start items-end md:-translate-x-10 lg:-translate-x-14 xl:-translate-x-16">
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

                  heroAlphaRef.current = { naturalW: w, naturalH: h, bbox: { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 } };
                } finally {
                  applyHeroSubjectCentering();
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Second Page - Proof of Work */}
      <section id="proof" className="relative min-h-screen w-full flex flex-col items-center justify-start z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 scroll-mt-28" style={{ background: 'transparent' }}>
        <div 
          ref={secondPageRef}
          className="w-full max-w-7xl opacity-0"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black mb-12 md:mb-16 text-center"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Proof of Work
          </h2>
          
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

      {/* Third Page - Vibe Coders Playground */}
      <section id="playground" className="relative min-h-screen w-full flex flex-col items-center justify-center z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 scroll-mt-28" style={{ background: 'transparent' }}>
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
      <section id="about" className="relative min-h-screen w-full flex flex-col items-center justify-center z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 scroll-mt-28" style={{ background: 'transparent' }}>
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
