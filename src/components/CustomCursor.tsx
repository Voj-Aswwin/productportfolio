import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    // Use GSAP's quickTo for high-performance cursor tracking
    const xToCursor = gsap.quickTo(cursor, "x", {duration: 0.1, ease: "power3"});
    const yToCursor = gsap.quickTo(cursor, "y", {duration: 0.1, ease: "power3"});
    
    const xToFollower = gsap.quickTo(follower, "x", {duration: 0.5, ease: "power3"});
    const yToFollower = gsap.quickTo(follower, "y", {duration: 0.5, ease: "power3"});

    const onMouseMove = (e: MouseEvent) => {
      // Offset by half dimensions to center
      xToCursor(e.clientX - 4);
      yToCursor(e.clientY - 4);
      
      xToFollower(e.clientX - 16);
      yToFollower(e.clientY - 16);
    };

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.2 });
      gsap.to(follower, { scale: 1.5, borderColor: '#FF2A2A', duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, borderColor: '#0066FF', duration: 0.2 });
    };

    // Add interactivity to clickable elements
    const handleMouseOverClickable = () => {
      gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(0, 102, 255, 0.1)', duration: 0.3 });
    };
    
    const handleMouseOutClickable = () => {
      gsap.to(follower, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    // Initial positioning off-screen
    gsap.set([cursor, follower], { x: -100, y: -100 });

    const interactiveSelectors = 'a, button, input, select, [role="button"], [tabindex="0"]';
    
    // We use event delegation on document body to catch dynamically added interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) {
        handleMouseOverClickable();
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelectors)) {
        handleMouseOutClickable();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[99999] mix-blend-difference"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[#0066FF] rounded-full pointer-events-none z-[99998] transition-colors duration-300"
      />
    </>
  );
};

export default CustomCursor;
