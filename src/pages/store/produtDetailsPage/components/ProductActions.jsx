// src/pages/ProductPage/components/ProductActions.js
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProductActions = ({ variants, selectedVariant, onVariantChange, onAddToCart }) => {
  const discount = selectedVariant.originalPrice > selectedVariant.price
    ? Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-8 py-8 border-y">
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Select Size</h3>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <button
              key={variant._id}
              onClick={() => onVariantChange(variant)}
              disabled={!variant.available}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm border-2 flex-grow sm:flex-grow-0 ${
                selectedVariant._id === variant._id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-500'
              } ${!variant.available ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">₹{selectedVariant.price}</span>
          {discount > 0 && (
            <span className="text-xl text-gray-400 line-through">₹{selectedVariant.originalPrice}</span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-sm font-semibold">{discount}% OFF</span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-transform transform hover:scale-105 shadow-lg"
        >
          <FiShoppingCart className="w-6 h-6" />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ProductActions;