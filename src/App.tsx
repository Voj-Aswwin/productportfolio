import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CosmicBackground from './components/CosmicBackground';
import ArtifactGallery from './components/ArtifactGallery';
import ImageGallery from './components/ImageGallery';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  
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
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ background: '#FFFFFF' }}>
      <CosmicBackground />
      
      {/* First Page - Homepage */}
      <section className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-8 md:py-0 z-10">
        {/* Left Side - Text */}
        <div className="flex-1 flex flex-col justify-center w-full md:w-auto mb-8 md:mb-0">
          {/* Hero intentionally left blank for now */}
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
