import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  onClose: () => void;
}

const PDFViewer = ({ pdfPath, title, onClose }: PDFViewerProps) => {
  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col bg-zinc-950 rounded-lg shadow-2xl border border-black/10">
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <h3 className="text-xl font-bold text-black" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            aria-label="Close PDF viewer"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfPath}
            className="w-full h-full"
            title={title}
          />
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
};

export default PDFViewer;
