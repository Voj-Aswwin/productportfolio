import { useState } from 'react';
import PDFViewer from './PDFViewer';
import PDFThumbnail from './PDFThumbnail';

export interface ArtifactCard {
  /** Modal title and accessible name */
  name: string;
  path: string;
  /** Small uppercase label above the headline (e.g. case competition) */
  category: string;
  /** Editorial headline shown under the thumbnail */
  heading: string;
  /** Two-line summary of what the PDF contains */
  description: string;
}

interface ArtifactGalleryProps {
  title: string;
  artifacts: ArtifactCard[];
  compact?: boolean;
}

const serif = "Georgia, 'Times New Roman', Times, serif";

const ArtifactGallery = ({ title, artifacts, compact = false }: ArtifactGalleryProps) => {
  const [selectedPdf, setSelectedPdf] = useState<{ path: string; name: string } | null>(null);

  if (artifacts.length === 0) return null;

  return (
    <>
      <div className={compact ? 'mb-6 md:mb-6' : 'mb-12'}>
        <h3
          className={[
            'font-bold text-black underline decoration-red-600 decoration-[3px] underline-offset-[8px]',
            compact ? 'text-xl sm:text-2xl md:text-3xl mb-6' : 'text-2xl sm:text-3xl md:text-4xl mb-8',
          ].join(' ')}
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {title}
        </h3>
        <div
          className={
            artifacts.length === 1
              ? 'grid grid-cols-1 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12'
              : compact
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12'
          }
        >
          {artifacts.map((artifact, index) => (
            <div
              key={`${artifact.path}-${index}`}
              onClick={() => setSelectedPdf({ path: artifact.path, name: artifact.name })}
              className={[
                'group cursor-pointer bg-white border border-black/10 rounded-lg overflow-hidden shadow-md shadow-black/5 hover:shadow-lg hover:border-black/20 transition-shadow duration-300',
                compact ? 'hover:scale-[1.03]' : 'hover:shadow-lg',
              ].join(' ')}
            >
              <div className="flex flex-col h-full">
                <div
                  className={
                    compact
                      ? 'aspect-[16/10] w-full bg-zinc-100 overflow-hidden'
                      : 'aspect-[16/10] w-full bg-zinc-100 overflow-hidden'
                  }
                >
                  <PDFThumbnail
                    pdfPath={artifact.path}
                    className="h-full w-full"
                  />
                </div>
                <div className={compact ? 'p-3 flex flex-col flex-1 text-left' : 'p-4 md:p-5 flex flex-col flex-1 text-left'}>
                  <p
                    className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.12em] uppercase mb-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#E57373' }}
                  >
                    {artifact.category}
                  </p>
                  <h4
                    className={`text-black font-bold leading-snug mb-2 ${compact ? 'text-base' : 'text-lg md:text-xl'}`}
                    style={{ fontFamily: serif }}
                  >
                    {artifact.heading}
                  </h4>
                  <p
                    className={`text-neutral-500 leading-relaxed ${compact ? 'text-sm' : 'text-[0.95rem] md:text-base'}`}
                    style={{ fontFamily: serif }}
                  >
                    {artifact.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPdf && (
        <PDFViewer
          pdfPath={selectedPdf.path}
          title={selectedPdf.name}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </>
  );
};

export default ArtifactGallery;

