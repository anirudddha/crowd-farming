// src/pages/ProductPage/components/ReviewList.js
import React from 'react';
import { FiStar, FiUser } from 'react-icons/fi';

const ReviewList = ({ reviews }) => (
  <div className="space-y-10">
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review._id} className="flex gap-4">
          <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
            {review.username?.[0]?.toUpperCase() || <FiUser />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{review.username || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-1 my-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-16 bg-gray-50 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800">No Reviews Yet</h3>
        <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
      </div>
    )}
  </div>
);

export default ReviewList;