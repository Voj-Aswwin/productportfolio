import React, { useState } from 'react';
import ProductModal, { type ProductType } from './ProductModal';

interface ProductShowcaseProps {
  products: ProductType[];
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-20 text-black/50" style={{ fontFamily: "'League Spartan', sans-serif" }}>
        More projects coming soon...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Pills Container */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group relative flex flex-col items-center text-left w-full sm:w-[340px] md:w-[400px] transition-all duration-500 hover:-translate-y-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20 rounded-3xl"
          >
            {/* Thumbnail Container */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black/5 border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-3xl pointer-events-none" />
            </div>
            
            {/* Title */}
            <h3 
              className="text-2xl md:text-3xl font-bold text-black border-b-2 border-transparent group-hover:border-black/20 pb-1 transition-all duration-300" 
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              {product.name}
            </h3>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductShowcase;
