import { useLayoutEffect, useRef } from 'react';
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

/** Approximate viewport Y of the alphabetic baseline for text in `el` (handles scaled boxes). */
function estimateViewportBaselineY(el: HTMLElement, sample: string): number {
  const r = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const font = style.font;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return r.bottom;

  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText(sample);
  const asc = m.actualBoundingBoxAscent;
  const desc = m.actualBoundingBoxDescent;
  if (
    asc == null ||
    desc == null ||
    Number.isNaN(asc) ||
    Number.isNaN(desc) ||
    asc + desc <= 0
  ) {
    const fs = parseFloat(style.fontSize) || 16;
    return r.bottom - fs * 0.22;
  }

  const h = r.height || 1;
  const textH = asc + desc;
  const descentPx = h * (desc / textH);
  return r.bottom - descentPx;
}

export default function MorphingMoneySS({
  moneyColor = '#00E054',
  delay = 0.45,
  finalScale = 0.88,
  dollarLetterSpacingEm = -0.12,
}: MorphingMoneySSProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);
  const dollarsRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const lettersEl = lettersRef.current;
    const dollarsEl = dollarsRef.current;
    if (!lettersEl || !dollarsEl) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Vertically nudge "$$" so its baseline matches the hidden "ss" (same as "Busine"). */
    const alignMoneyBaseline = () => {
      const L = lettersRef.current;
      const D = dollarsRef.current;
      if (!L || !D) return;

      const dOp = Number(gsap.getProperty(D, 'opacity'));
      if (!Number.isFinite(dOp) || dOp < 0.5) return;

      const letterSnap = {
        scaleX: Number(gsap.getProperty(L, 'scaleX')) || 1,
        scaleY: Number(gsap.getProperty(L, 'scaleY')) || 1,
        rotation: Number(gsap.getProperty(L, 'rotation')) || 0,
        filter: String(gsap.getProperty(L, 'filter') ?? 'none'),
        opacity: Number(gsap.getProperty(L, 'opacity')),
      };
      if (!Number.isFinite(letterSnap.opacity)) letterSnap.opacity = 0;

      const dollarSnap = {
        scaleX: Number(gsap.getProperty(D, 'scaleX')) || finalScale,
        scaleY: Number(gsap.getProperty(D, 'scaleY')) || finalScale,
        rotation: Number(gsap.getProperty(D, 'rotation')) || 0,
      };

      gsap.set(L, { scaleX: 1, scaleY: 1, rotation: 0, filter: 'none' });
      gsap.set(D, {
        scaleX: finalScale,
        scaleY: finalScale,
        rotation: 0,
        y: 0,
      });

      void L.offsetHeight;

      const yL = estimateViewportBaselineY(L, 'ss');
      const yD = estimateViewportBaselineY(D, '$$');
      const delta = yL - yD;

      gsap.set(L, letterSnap);
      gsap.set(D, { ...dollarSnap, y: delta });
    };

    const rootEl = rootRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && rootEl
        ? new ResizeObserver(() => {
            alignMoneyBaseline();
          })
        : null;
    if (ro && rootEl) ro.observe(rootEl);

    if (reduceMotion) {
      gsap.set(lettersEl, { opacity: 0 });
      gsap.set(dollarsEl, {
        opacity: 1,
        left: '50%',
        xPercent: -50,
        top: 0,
        y: 0,
        scale: finalScale,
        rotate: 0,
      });
      requestAnimationFrame(() => alignMoneyBaseline());
      void document.fonts?.ready?.then(() => alignMoneyBaseline());
      return () => {
        ro?.disconnect();
      };
    }

    const tl = gsap.timeline({ delay });

    gsap.set(dollarsEl, {
      left: '50%',
      xPercent: -50,
      top: 0,
      y: 0,
      opacity: 0,
      scale: Math.max(0.6, finalScale * 0.75),
      rotate: -6,
      transformOrigin: '50% 55%',
    });

    gsap.set(lettersEl, {
      opacity: 1,
      filter: 'blur(0px)',
      transformOrigin: '50% 70%',
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
      .to(dollarsEl, { duration: 0.42, y: 0, ease: 'bounce.out' })
      .to(
        dollarsEl,
        { duration: 0.16, scaleX: finalScale * 1.04, scaleY: finalScale * 0.96, ease: 'power2.out' },
        '<-0.18'
      )
      .to(
        dollarsEl,
        {
          duration: 0.18,
          scaleX: finalScale,
          scaleY: finalScale,
          ease: 'power2.out',
          onComplete: () => alignMoneyBaseline(),
        },
        '>-0.02'
      );

    void document.fonts?.ready?.then(() => alignMoneyBaseline());

    return () => {
      ro?.disconnect();
      tl.kill();
    };
  }, [delay, finalScale]);

  return (
    <span ref={rootRef} className="relative inline-block align-baseline">
      {/* Keep real "ss" in DOM for spacing/accessibility; animate it away visually. */}
      <span ref={lettersRef} className="inline-block will-change-transform">
        ss
      </span>

      {/* "$$" overlay — horizontal center only in CSS; GSAP + alignMoneyBaseline handle Y */}
      <span
        ref={dollarsRef}
        aria-hidden="true"
        className="absolute left-1/2 top-0 font-black will-change-transform"
        style={{
          color: moneyColor,
          letterSpacing: `${dollarLetterSpacingEm}em`,
          textShadow: '0 0.08em 0.22em rgba(0,0,0,0.18)',
          filter: `drop-shadow(0 0 0.22em ${moneyColor}55)`,
        }}
      >
        $$
      </span>
    </span>
  );
}
