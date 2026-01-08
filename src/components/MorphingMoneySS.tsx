import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type MorphingMoneySSProps = {
  /** CSS color string for the "$$". */
  moneyColor?: string;
  /** Delay in seconds before the morph starts. */
  delay?: number;
  /** Final resting scale for the "$$" after morphing. */
  finalScale?: number;
  /** Negative values tighten the gap between the two "$" characters (in em). */
  dollarLetterSpacingEm?: number;
};

export default function MorphingMoneySS({
  moneyColor = '#16a34a',
  delay = 0.45,
  finalScale = 0.88,
  dollarLetterSpacingEm = -0.12,
}: MorphingMoneySSProps) {
  const lettersRef = useRef<HTMLSpanElement>(null);
  const dollarsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lettersEl = lettersRef.current;
    const dollarsEl = dollarsRef.current;
    if (!lettersEl || !dollarsEl) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      lettersEl.style.opacity = '0';
      dollarsEl.style.opacity = '1';
      dollarsEl.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
      return;
    }

    const tl = gsap.timeline({ delay });

    gsap.set(lettersEl, {
      opacity: 1,
      filter: 'blur(0px)',
      transformOrigin: '50% 70%',
    });

    gsap.set(dollarsEl, {
      opacity: 0,
      scale: Math.max(0.6, finalScale * 0.75),
      rotate: -6,
      transformOrigin: '50% 55%',
    });

    tl.to(lettersEl, {
      duration: 0.18,
      scaleX: 1.12,
      scaleY: 0.9,
      rotation: 4,
      ease: 'power2.out',
    })
      .to(
        lettersEl,
        {
          duration: 0.22,
          scale: 0.55,
          opacity: 0,
          filter: 'blur(6px)',
          ease: 'power2.inOut',
        },
        '>-0.02'
      )
      .to(
        dollarsEl,
        {
          duration: 0.26,
          opacity: 1,
          scale: finalScale,
          rotate: 0,
          ease: 'back.out(2.2)',
        },
        '<0.06'
      )
      .to(dollarsEl, { duration: 0.16, y: '-0.14em', ease: 'power2.out' }, '>-0.04')
      .to(dollarsEl, { duration: 0.42, y: '0em', ease: 'bounce.out' })
      .to(
        dollarsEl,
        { duration: 0.16, scaleX: finalScale * 1.04, scaleY: finalScale * 0.96, ease: 'power2.out' },
        '<-0.18'
      )
      .to(dollarsEl, { duration: 0.18, scaleX: finalScale, scaleY: finalScale, ease: 'power2.out' }, '>-0.02');

    return () => {
      tl.kill();
    };
  }, [delay, finalScale]);

  return (
    <span className="relative inline-block align-baseline">
      {/* Keep real "ss" in DOM for spacing/accessibility; animate it away visually. */}
      <span ref={lettersRef} className="inline-block will-change-transform">
        ss
      </span>

      {/* "$$" overlay */}
      <span
        ref={dollarsRef}
        aria-hidden="true"
        className="absolute left-1/2 top-[58%] font-black will-change-transform"
        style={{
          transform: 'translate(-50%, -50%) scale(0.7)',
          color: moneyColor,
          letterSpacing: `${dollarLetterSpacingEm}em`,
          textShadow: '0 0.08em 0.22em rgba(0,0,0,0.18)',
          // slight glow to feel "money"
          filter: `drop-shadow(0 0 0.22em ${moneyColor}55)`,
        }}
      >
        $$
      </span>
    </span>
  );
}

