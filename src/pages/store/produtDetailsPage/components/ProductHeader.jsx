// src/pages/ProductPage/components/ProductHeader.js
import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const ProductHeader = ({ name, category, farmName, rating, reviewsCount, isOrganic }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">{category}</span>
      {isOrganic && (
        <span className="flex items-center gap-2 text-sm text-emerald-700">
          <FaLeaf /> Certified Organic
        </span>
      )}
    </div>
    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">{name}</h1>
    <p className="text-lg text-gray-500">From <span className="font-semibold text-gray-700">{farmName}</span></p>
    <a href="#reviews" className="flex items-center gap-2 group">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      <span className="text-sm text-gray-600 group-hover:underline">{rating.toFixed(1)} ({reviewsCount} reviews)</span>
    </a>
  </div>
);

export default ProductHeader;