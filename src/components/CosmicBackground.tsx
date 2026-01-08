import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create comets - moving objects with glowing trails
    const comets: Array<{ 
      x: number; 
      y: number; 
      vx: number; 
      vy: number; 
      size: number;
      opacity: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
      color: string;
    }> = [];
    const numComets = 8;

    for (let i = 0; i < numComets; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      comets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.5,
        trail: [],
        color: '#000000',
      });
    }

    // Animate comets with GSAP
    comets.forEach((comet) => {
      gsap.to(comet, {
        opacity: Math.random() * 0.3 + 0.7,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    let animationFrame: number;

    const animate = () => {
      // Draw cream background
      ctx.fillStyle = '#FFF7E6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw comets with trails
      comets.forEach((comet) => {
        // Update comet position
        comet.x += comet.vx;
        comet.y += comet.vy;

        // Wrap around screen
        if (comet.x < -50) comet.x = canvas.width + 50;
        if (comet.x > canvas.width + 50) comet.x = -50;
        if (comet.y < -50) comet.y = canvas.height + 50;
        if (comet.y > canvas.height + 50) comet.y = -50;

        // Add current position to trail
        comet.trail.push({ x: comet.x, y: comet.y, opacity: comet.opacity });
        
        // Limit trail length
        if (comet.trail.length > 20) {
          comet.trail.shift();
        }

        // Draw comet trail
        for (let i = 0; i < comet.trail.length; i++) {
          const point = comet.trail[i];
          const trailOpacity = (i / comet.trail.length) * point.opacity * 0.6;
          
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            comet.size * (1 + i * 0.1)
          );
          
          const rgb = '0, 0, 0';
          gradient.addColorStop(0, `rgba(${rgb}, ${trailOpacity})`);
          gradient.addColorStop(0.5, `rgba(${rgb}, ${trailOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${rgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, comet.size * (1 + i * 0.1), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw comet head (brightest point)
        const headGradient = ctx.createRadialGradient(
          comet.x,
          comet.y,
          0,
          comet.x,
          comet.y,
          comet.size * 2
        );
        const rgb = '0, 0, 0';
        headGradient.addColorStop(0, `rgba(${rgb}, ${comet.opacity})`);
        headGradient.addColorStop(0.5, `rgba(${rgb}, ${comet.opacity * 0.7})`);
        headGradient.addColorStop(1, `rgba(${rgb}, 0)`);

        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw comet core
        ctx.fillStyle = `rgba(${rgb}, ${comet.opacity})`;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CosmicBackground;
