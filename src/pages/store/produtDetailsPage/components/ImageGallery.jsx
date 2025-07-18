// src/pages/ProductPage/components/ImageGallery.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">No Image</div>;
  }

  return (
    // On mobile (flex-col-reverse), thumbnails are below. On desktop (md:flex-row), they are on the side.
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`w-full md:w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
              selectedImage.url === image.url
                ? 'border-emerald-500 ring-2 ring-emerald-200'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage.url}
            src={selectedImage.url}
            alt={productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;