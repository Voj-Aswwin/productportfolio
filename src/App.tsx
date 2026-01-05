import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicBackground from './components/CosmicBackground';
import ArtifactGallery from './components/ArtifactGallery';
import ImageGallery from './components/ImageGallery';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [ampersandLeft, setAmpersandLeft] = useState<string>('275px');
  const [ampersandTop, setAmpersandTop] = useState<string>('18px');
  const ampersandTextRef = useRef<HTMLSpanElement>(null);
  const designTextRef = useRef<HTMLHeadingElement>(null);
  const secondPageRef = useRef<HTMLDivElement>(null);
  const thirdPageRef = useRef<HTMLDivElement>(null);
  const fourthPageRef = useRef<HTMLDivElement>(null);

  // Artifact data
  const productDesignArtifacts = [
    { name: 'PetInsurance - Product Design.pdf', path: '/Artefacts/Product Design/PetInsurance - Product Design.pdf' }
  ];

  const prdArtifacts = [
    { name: 'BMS PRD.pdf', path: '/Artefacts/PRD/BMS PRD.pdf' }
  ];

  const productTeardownsArtifacts = [
    { name: 'Inshots Product Breakdown.pdf', path: '/Artefacts/Product Teardowns/Inshots Product Breakdown.pdf' },
    { name: 'The Souled Store Product Breakdown.pdf', path: '/Artefacts/Product Teardowns/The Souled Store Product Breakdown.pdf' }
  ];

  const vibeCodedImages = [
    '/Vibe Coded Images/Screenshot 2026-01-05 at 2.10.47 PM.png',
    '/Vibe Coded Images/Screenshot 2026-01-05 at 2.11.18 PM.png'
  ];

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Vojaswwin_Product_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleResize = () => {
      setPageHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Calculate ampersand left position based on design text width
  useEffect(() => {
    const updateAmpersandLeft = () => {
      if (designTextRef.current) {
        const designSpan = designTextRef.current.querySelector('span');
        if (designSpan) {
          const designSpanRect = designSpan.getBoundingClientRect();
          // Position ampersand to the right of design text with spacing
          // Since text is rotated 90deg, use width + spacing
          // Responsive spacing: smaller on mobile
          const spacing = window.innerWidth < 768 ? 10 : 20;
          const calculatedLeft = designSpanRect.width + spacing;
          
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/3196ccad-746a-4f33-8531-4846d00e1909',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:54',message:'Calculating ampersand left position',data:{designSpanWidth:designSpanRect.width,calculatedLeft,spacing},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          setAmpersandLeft(`${calculatedLeft}px`);
          
          // Update top position based on screen size
          const topPosition = window.innerWidth < 768 ? '14px' : '18px';
          setAmpersandTop(topPosition);
        }
      }
    };
    
    // Update after initial render and on resize
    const timeoutId = setTimeout(updateAmpersandLeft, 100);
    window.addEventListener('resize', updateAmpersandLeft);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateAmpersandLeft);
    };
  }, [windowWidth]);

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

  // Calculate if we're past the first page
  const isPastFirstPage = scrollY > pageHeight * 0.3;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: '#FFFFFF' }}>
      <CosmicBackground />
      
      {/* First Page - Homepage */}
      <section className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-8 md:py-0 z-10">
        {/* Left Side - Text */}
        <div className="flex-1 flex flex-col justify-center w-full md:w-auto mb-8 md:mb-0">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-black leading-none mb-0">
              <span style={{ fontFamily: "'League Spartan', sans-serif", transform: 'rotate(90deg)' }}>prod,</span>
            </h1>
            <h1 
              ref={designTextRef}
              className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-black leading-none mb-0 relative inline-block -mt-2 md:-mt-4"
            >
              <span style={{ fontFamily: "'League Spartan', sans-serif", transform: 'rotate(90deg)' }}>design</span>
              {!isPastFirstPage && (
                <span
                  ref={ampersandTextRef}
                  className="absolute inline-block ml-1 md:ml-2"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    transform: 'rotate(360deg)',
                    color: 'rgba(255, 107, 107, 1)',
                    left: ampersandLeft,
                    top: ampersandTop,
                  }}
                >
                  &
                </span>
              )}
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-black leading-none -mt-2 md:-mt-4">
              <span style={{ fontFamily: "'League Spartan', sans-serif", transform: 'rotate(90deg)' }}>tech.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Second Page - Proof of Work */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-start z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24" style={{ background: 'transparent' }}>
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
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24" style={{ background: 'transparent' }}>
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
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-10 px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24" style={{ background: 'transparent' }}>
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
              I'm a curious mind constantly exploring the intersection of product design, technology, and human behavior. 
              Every problem is a puzzle waiting to be solved, and I thrive on breaking down complex challenges into 
              elegant, user-centric solutions.
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              My approach is deeply analytical—I dig into data, user insights, and market dynamics to understand the 
              "why" behind every decision. But I'm also growing, learning, and evolving with each project, each 
              conversation, and each failure that teaches me something new.
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              I believe great products aren't just built—they're crafted through iteration, empathy, and a relentless 
              pursuit of excellence. Whether I'm designing user flows, writing PRDs, or tearing down products to 
              understand their DNA, I'm always asking: "How can we make this better?"
            </p>
            <p style={{ fontFamily: "'League Spartan', sans-serif" }}>
              The journey of growth never ends, and I'm here for it—one thoughtful decision at a time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
