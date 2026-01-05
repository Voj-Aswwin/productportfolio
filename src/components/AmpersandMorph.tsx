import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AmpersandMorphProps {
  scrollY: number;
  containerHeight: number;
  startPosition?: { x: number; y: number };
}

const AmpersandMorph = ({ scrollY, containerHeight, startPosition }: AmpersandMorphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const currentTargetPathRef = useRef<string>("");
  
  // Ampersand SVG path
  const ampersandPath = "M 50 15 Q 25 15, 25 40 Q 25 55, 40 60 Q 30 65, 30 75 Q 30 85, 45 85 Q 60 85, 60 75 Q 60 70, 55 68 Q 70 63, 70 40 Q 70 15, 50 15 M 55 68 Q 50 70, 45 70 Q 40 70, 40 75 Q 40 80, 45 80 Q 50 80, 55 75 Q 55 72, 55 68";
  
  // Intermediate morph path
  const intermediatePath = "M 50 20 Q 30 20, 30 40 Q 30 50, 40 50 Q 35 55, 35 65 Q 35 75, 45 75 Q 55 75, 55 65 Q 55 60, 50 60 Q 65 55, 65 40 Q 65 20, 50 20";
  
  // Circle path (target shape)
  const circlePath = "M 50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20";

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    if (!container || !path) return;

    // Set initial path
    path.setAttribute('d', ampersandPath);
    currentTargetPathRef.current = ampersandPath;

    // Set transform origin and centering once
    gsap.set(container, { xPercent: -50, yPercent: -50 });

    // Create quickTo functions for smooth, performant scroll-based animations
    // Using quickTo prevents creating new tweens on every scroll update
    const quickX = gsap.quickTo(container, "x", { duration: 0.3, ease: "power1.out" });
    const quickY = gsap.quickTo(container, "y", { duration: 0.3, ease: "power1.out" });
    const quickScale = gsap.quickTo(container, "scale", { duration: 0.3, ease: "power1.out" });
    const quickOpacity = gsap.quickTo(container, "opacity", { duration: 0.3, ease: "power1.out" });
    const quickStrokeWidth = gsap.quickTo(path, "strokeWidth", { duration: 0.3, ease: "power1.out" });

    const updateAnimation = () => {
      // Calculate scroll progress (0 to 1+ as we scroll past first page)
      const scrollProgress = scrollY / containerHeight;
      
      // Morph progress starts after some scroll, completes by scrollProgress 1.5 (center of second page)
      const morphStart = 0.2;
      const morphEnd = 1.5;
      const morphProgress = Math.min(Math.max((scrollProgress - morphStart) / (morphEnd - morphStart), 0), 1);
      
      // Determine target path based on morph progress
      let targetPath: string;
      let strokeWidth: number;
      
      if (morphProgress < 0.3) {
        // Show ampersand (0 to 0.3)
        targetPath = ampersandPath;
        strokeWidth = 3;
      } else if (morphProgress < 0.7) {
        // Morph from ampersand to intermediate (0.3 to 0.7)
        const t = (morphProgress - 0.3) / 0.4;
        targetPath = intermediatePath;
        strokeWidth = 3 + t * 0.5; // 3 to 3.5
      } else {
        // Morph from intermediate to circle (0.7 to 1.0)
        const t = (morphProgress - 0.7) / 0.3;
        targetPath = circlePath;
        strokeWidth = 3.5 + t * 0.5; // 3.5 to 4
      }

      // Only create a new tween if the target path has changed
      // This prevents creating conflicting tweens on every scroll update
      if (targetPath !== currentTargetPathRef.current) {
        // Kill any existing path tween to avoid conflicts
        if (tweenRef.current) {
          tweenRef.current.kill();
        }

        // Create a smooth tween for path morphing
        tweenRef.current = gsap.to(path, {
          attr: { d: targetPath },
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: true, // Prevent conflicts
        });

        currentTargetPathRef.current = targetPath;
      }

      // Update stroke width using quickTo
      quickStrokeWidth(strokeWidth);

      // Calculate position and visibility
      let x = window.innerWidth / 2;
      let y = containerHeight * 0.3;
      let scale = 1;
      let opacity = 0;

      if (scrollProgress < 0.1) {
        // Before scroll: position at text location or hidden
        if (startPosition) {
          x = startPosition.x;
          y = startPosition.y;
          opacity = 0;
        } else {
          opacity = 0;
        }
      } else if (scrollProgress < 0.3) {
        // Text is fading, morph widget appears
        const t = (scrollProgress - 0.1) / 0.2;
        if (startPosition) {
          x = startPosition.x + (window.innerWidth / 2 - startPosition.x) * t;
          y = startPosition.y + (containerHeight * 0.3 - startPosition.y) * t;
        }
        opacity = t;
      } else if (scrollProgress < 1.5) {
        // Moving to center and morphing, landing in center of second page
        const t = (scrollProgress - 0.3) / 1.2;
        x = window.innerWidth / 2;
        // Start from top area, drop down to center of second page (containerHeight * 1.5)
        const startY = containerHeight * 0.3;
        const endY = containerHeight * 1.5; // Center of second page
        y = startY + (endY - startY) * t;
        // Scale up as it morphs - responsive scaling for mobile
        const maxScale = window.innerWidth < 768 ? 1.2 : 1.5;
        scale = 1 + t * maxScale;
        opacity = 1;
      } else {
        // Past center of second page: stay in place or fade
        x = window.innerWidth / 2;
        y = containerHeight * 1.5; // Center of second page
        // Responsive final scale for mobile
        scale = window.innerWidth < 768 ? 2.2 : 2.5;
        opacity = Math.max(0, 1 - (scrollProgress - 1.5) * 0.5);
      }

      // Use quickTo for smooth, performant updates
      // xPercent and yPercent are set once in the initial setup
      quickX(x);
      quickY(y);
      quickScale(scale);
      quickOpacity(opacity);
    };

    // Update on scroll with requestAnimationFrame for smoothness
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateAnimation(); // Initial update

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [scrollY, containerHeight, startPosition]);

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none"
      style={{
        left: 0,
        top: 0,
        zIndex: 20,
      }}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default AmpersandMorph;
