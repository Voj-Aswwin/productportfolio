import { useState } from 'react';
import PDFViewer from './PDFViewer';
import PDFThumbnail from './PDFThumbnail';

interface Artifact {
  name: string;
  path: string;
}

interface ArtifactGalleryProps {
  title: string;
  artifacts: Artifact[];
  compact?: boolean;
}

const ArtifactGallery = ({ title, artifacts, compact = false }: ArtifactGalleryProps) => {
  const [selectedPdf, setSelectedPdf] = useState<{ path: string; name: string } | null>(null);

  return (
    <>
      <div className={compact ? 'mb-6 md:mb-6' : 'mb-12'}>
        <h3 
          className={[
            'font-bold text-black',
            compact ? 'text-xl sm:text-2xl md:text-3xl mb-4' : 'text-2xl sm:text-3xl md:text-4xl mb-6',
          ].join(' ')}
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          {title}
        </h3>
        <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'}>
          {artifacts.map((artifact, index) => (
            <div
              key={index}
              onClick={() => setSelectedPdf({ path: artifact.path, name: artifact.name })}
              className={[
                'group cursor-pointer bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300',
                compact ? 'hover:scale-[1.03]' : 'hover:scale-105',
              ].join(' ')}
            >
              <div className="flex flex-col">
                <div className={compact ? 'h-40 w-full bg-gray-100 overflow-hidden' : 'h-48 w-full bg-gray-100 overflow-hidden'}>
                  <PDFThumbnail 
                    pdfPath={artifact.path} 
                    className="h-full w-full"
                  />
                </div>
                <div className={compact ? 'p-3' : 'p-4'}>
                  <p 
                    className="text-center text-sm md:text-base font-semibold text-black break-words"
                    style={{ fontFamily: "'League Spartan', sans-serif" }}
                  >
                    {artifact.name.replace('.pdf', '')}
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

