// src/pages/ProductPage/components/ReviewForm.js
import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-6">
      <div>
        <label className="block text-md font-semibold text-gray-800 mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button key={starValue} type="button" onClick={() => setRating(starValue)}>
                <FiStar className={`w-8 h-8 transition-all ${starValue <= rating ? 'fill-current text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-md font-semibold text-gray-800 mb-2">Your Review</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          placeholder="What did you like or dislike?"
        />
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={onCancel} className="w-full py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black">
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;