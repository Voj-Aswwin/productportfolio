import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((imagePath, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(imagePath)}
            className="group cursor-pointer bg-white border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={imagePath}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  console.error('Failed to load image:', imagePath);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] m-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
              aria-label="Close image viewer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Full size gallery image"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

