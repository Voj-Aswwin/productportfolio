import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Github } from 'lucide-react';
import { gsap } from 'gsap';

export interface ProductType {
  id: string;
  name: string;
  thumbnail: string;
  video: string;
  description: string;
  pmUseCase: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

interface ProductModalProps {
  product: ProductType;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Animate in
    if (overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    // Animate out
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.95, opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 opacity-0"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative flex flex-col md:flex-row w-full max-w-6xl max-h-[92vh] bg-zinc-50 rounded-3xl overflow-hidden opacity-0 border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} className="text-black/70" />
        </button>

        {/* Left Side: Video — warm neutral bg that blends with the portfolio palette */}
        <div className="w-full md:w-1/2 h-56 sm:h-64 md:h-auto bg-zinc-100 flex flex-col justify-center relative overflow-hidden md:rounded-l-3xl">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls
            src={product.video}
            poster={product.thumbnail}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side: Details — compact layout that fits without scrolling */}
        <div className="w-full md:w-1/2 px-7 py-6 md:px-8 md:py-7 flex flex-col justify-between overflow-y-auto" style={{ fontFamily: "'League Spartan', sans-serif" }}>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-4">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-neutral-700 leading-relaxed text-base mb-4">
              {product.description}
            </p>

            {/* PM Use Case — signature accent card */}
            <div className="bg-orange-950/40 px-4 py-3.5 rounded-xl border border-orange-400/35 mb-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-orange-200 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                Why I built this (PM Perspective)
              </h4>
              <p className="text-orange-50/90 leading-relaxed text-[15px]">
                {product.pmUseCase}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-neutral-500 mb-2 tracking-widest uppercase">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {product.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black/[0.06] text-neutral-800 rounded-full text-sm font-medium border border-black/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons — always visible at bottom */}
          <div className="flex gap-3 pt-2">
            <a
              href={product.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-bold text-base hover:bg-neutral-200 transition-all hover:-translate-y-0.5"
            >
              <ExternalLink size={18} />
              Try Product
            </a>
            <a
              href={product.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-transparent text-black border border-black/20 px-5 py-3 rounded-xl font-bold text-base hover:bg-black/10 transition-all hover:-translate-y-0.5"
            >
              <Github size={18} />
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default ProductModal;
