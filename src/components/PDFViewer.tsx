import { X } from 'lucide-react';

interface PDFViewerProps {
  pdfPath: string;
  title: string;
  onClose: () => void;
}

const PDFViewer = ({ pdfPath, title, onClose }: PDFViewerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col bg-white rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-black" style={{ fontFamily: "'League Spartan', sans-serif" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close PDF viewer"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={encodeURI(pdfPath)}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;


