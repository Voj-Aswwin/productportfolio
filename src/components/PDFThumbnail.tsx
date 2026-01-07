import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// Set up the worker for pdf.js using the local worker from the installed package
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFThumbnailProps {
  pdfPath: string;
  className?: string;
}

const PDFThumbnail = ({ pdfPath, className = '' }: PDFThumbnailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadThumbnail = async () => {
      // Cancel any previous render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      
      if (!canvasRef.current) {
        return;
      }

      try {
        if (!isMounted) return;
        setLoading(true);
        setError(false);

        // Load the PDF
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        // Get the first page
        const page = await pdf.getPage(1);

        if (!isMounted) return;

        // Calculate scale to fit within thumbnail size
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        
        if (!canvas || !isMounted) return;
        
        const context = canvas.getContext('2d');

        if (!context) {
          return;
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
        
        if (!isMounted) return;
        
        renderTaskRef.current = null;
        
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error loading PDF thumbnail:', err);
        setError(true);
        setLoading(false);
        renderTaskRef.current = null;
      }
    };

    loadThumbnail();
    
    // Cleanup function to cancel render task on unmount or when pdfPath changes
    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pdfPath]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-6xl">📄</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-4xl">📄</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default PDFThumbnail;


