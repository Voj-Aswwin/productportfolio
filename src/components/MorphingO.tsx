import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type MorphingOProps = {
  /** CSS color string for the ball. */
  ballColor?: string;
  /** Delay in seconds before the morph starts. */
  delay?: number;
  /**
   * Optical horizontal tweak (in em) to center the ball between surrounding letters.
   * Useful because kerning/advance-width centering doesn't always look visually centered.
   */
  ballXOffsetEm?: number;
  /**
   * Optical vertical tweak (in em). Positive values move the ball DOWN.
   * Useful to make the ball visually touch the baseline like the original "o".
   */
  ballYOffsetEm?: number;
};

export default function MorphingO({
  ballColor = '#2D7FF9',
  delay = 0.25,
  ballXOffsetEm = -0.02,
  ballYOffsetEm = 0.06,
}: MorphingOProps) {
  const letterRef = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const letterEl = letterRef.current;
    const ballEl = ballRef.current;
    if (!letterEl || !ballEl) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      // Keep it simple: show the blue ball state without motion.
      letterEl.style.opacity = '0';
      ballEl.style.opacity = '1';
      ballEl.style.transform = 'scale(1)';
      return;
    }

    const tl = gsap.timeline({ delay });

    gsap.set(letterEl, {
      transformOrigin: '50% 70%',
      opacity: 1,
      filter: 'blur(0px)',
    });

    gsap.set(ballEl, {
      opacity: 0,
      scale: 0,
      y: 0,
      transformOrigin: '50% 50%',
    });

    tl.to(letterEl, {
      duration: 0.18,
      scaleX: 1.12,
      scaleY: 0.9,
      rotation: -6,
      ease: 'power2.out',
    })
      .to(
        letterEl,
        {
          duration: 0.22,
          scale: 0.6,
          opacity: 0,
          filter: 'blur(6px)',
          ease: 'power2.inOut',
        },
        '>-0.02'
      )
      .to(
        ballEl,
        {
          duration: 0.24,
          opacity: 1,
          scale: 1,
          ease: 'back.out(2.4)',
        },
        '<0.06'
      )
      .to(ballEl, { duration: 0.16, y: '-0.18em', ease: 'power2.out' }, '>-0.02')
      .to(ballEl, { duration: 0.42, y: '0em', ease: 'bounce.out' })
      .to(ballEl, { duration: 0.18, scaleX: 1.1, scaleY: 0.92, ease: 'power2.out' }, '<-0.18')
      .to(ballEl, { duration: 0.2, scaleX: 1, scaleY: 1, ease: 'power2.out' }, '>-0.02');

    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <span className="relative inline-block align-baseline">
      {/* Keep a real "o" in the DOM for accessibility/selection; animate it away visually. */}
      <span ref={letterRef} className="inline-block will-change-transform">
        o
      </span>

      {/* Ball overlay (wrapper handles centering + optical offset; inner ball is what GSAP animates) */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[58%] will-change-transform"
        style={{
          transform: `translate(calc(-50% + ${ballXOffsetEm}em), calc(-50% + ${ballYOffsetEm}em))`,
        }}
      >
        <span
          ref={ballRef}
          className="block rounded-full will-change-transform"
          style={{
            width: '0.56em',
            height: '0.56em',
            transform: 'scale(0)',
            background: `radial-gradient(circle at 30% 30%, #ffffffcc 0%, ${ballColor} 42%, #0b4fd6 100%)`,
            boxShadow: '0 0.08em 0.22em rgba(0,0,0,0.18)',
          }}
        />
      </span>
    </span>
  );
}

