import React, { useEffect, useRef, useState } from 'react';

export interface StartupType {
  id: string;
  name: string;
  tagline: string;
  videoEmbedUrl: string;
  description: string;
  myRole: string;
  contributions: string[];
}

interface StartupShowcaseProps {
  startups: StartupType[];
}

const StartupShowcase: React.FC<StartupShowcaseProps> = ({ startups }) => {
  return (
    <div className="w-full flex flex-col gap-16 md:gap-24">
      {startups.map((startup) => (
        <StartupRow key={startup.id} startup={startup} />
      ))}
    </div>
  );
};

const StartupRow: React.FC<{ startup: StartupType }> = ({ startup }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeSrc, setIframeSrc] = useState('');

  // Load iframe src only when section scrolls into view so autoplay triggers correctly
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !iframeSrc) {
          setIframeSrc(startup.videoEmbedUrl);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startup.videoEmbedUrl, iframeSrc]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row gap-8 md:gap-12 items-start w-full"
    >
      {/* Left — video player */}
      <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden bg-zinc-100 border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] shrink-0">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            title={startup.name}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-zinc-100">
            <span className="text-neutral-400 text-sm tracking-widest uppercase">Scroll to load</span>
          </div>
        )}
      </div>

      {/* Right — description */}
      <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        <p
          className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase mb-2"
          style={{ color: '#E57373', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Startup
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-1">
          {startup.name}
        </h3>
        <p className="text-neutral-500 text-base mb-5">{startup.tagline}</p>

        <p className="text-neutral-700 leading-relaxed text-base mb-6">
          {startup.description}
        </p>

        <div className="bg-neutral-900 px-4 py-4 rounded-xl border border-orange-400/20">
          <h4 className="flex items-center gap-2 text-sm font-bold text-orange-200 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
            My Role — {startup.myRole}
          </h4>
          <ul className="space-y-2">
            {startup.contributions.map((c, i) => (
              <li key={i} className="flex gap-2 leading-relaxed text-[15px]">
                <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-orange-400/60" />
                <span className="text-white/85">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartupShowcase;
