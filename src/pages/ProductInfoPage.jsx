import React, { useState } from 'react';
import { FiStar, FiShoppingCart, FiClock, FiPackage, FiHeart } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const ProductPage = () => {
  // Dummy state and product data for demonstration.
  const [selectedMedia, setSelectedMedia] = useState({ type: "image", url: "https://via.placeholder.com/500" });
  const [selectedWeight, setSelectedWeight] = useState({ size: 1, unit: "kg" });
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  
  const product = {
    name: "Organic Whole Wheat Flour",
    category: "Flours",
    farmName: "Green Valley Farms",
    price: 45,
    originalPrice: 55,
    media: [
      { type: "image", url: "https://png.pngtree.com/thumb_back/fh260/background/20230721/pngtree-assorted-grocery-items-arranged-in-a-white-3d-rendering-of-a-image_3722980.jpg" },
      { type: "image", url: "https://okcredit-blog-images-prod.storage.googleapis.com/2020/12/organic3.jpg" },
      { type: "video", url: "https://okcredit-blog-images-prod.storage.googleapis.com/2020/12/organic3.jpg" }
    ],
    weights: [
      { size: 1, unit: "kg" },
      { size: 5, unit: "kg" },
      { size: 10, unit: "kg" }
    ],
    specifications: {
      shelfLife: "6 months",
      packaging: "Resealable pouch"
    },
    description: "Premium quality whole wheat flour made from organically grown wheat.",
    reviews: [
      { username: "johndoe", rating: 4, comment: "Great product!" },
      { username: "janedoe", rating: 5, comment: "Absolutely love it!" },
      { username: "Aniruddha", rating: 5, comment: "Maja aa gaya bhaii" }
    ]
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Handle review submission here...
    console.log("New review submitted:", newReviewRating, newReviewComment);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Media and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl shadow-xl border-8 border-white bg-white overflow-hidden">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt={product.name}
                  className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/video-poster.jpg"
                >
                  <source src={selectedMedia.url} type="video/mp4" />
                </video>
              )}
              
              {/* Organic Badge */}
              <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <FaLeaf className="w-5 h-5" />
                <span className="font-semibold">USDA Organic</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-4 px-8">
              {product.media.map((mediaItem, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMedia(mediaItem)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                    selectedMedia.url === mediaItem.url 
                      ? 'border-green-500 scale-110 shadow-lg' 
                      : 'border-white hover:border-green-200'
                  }`}
                >
                  {mediaItem.type === "image" ? (
                    <img
                      src={mediaItem.url}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FiHeart className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <div className="flex items-center text-amber-600">
                  {Array(5).fill().map((_, i) => (
                    <FiStar key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
              <h1 className="text-5xl font-serif font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 font-medium">From {product.farmName}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-green-700">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>

            {/* Weight Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Size</h3>
              <div className="flex gap-3">
                {product.weights.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeight(option)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedWeight.size === option.size
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {option.size} {option.unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50">
                <FiClock className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Shelf Life</h4>
                <p className="text-gray-600">{product.specifications.shelfLife}</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50">
                <FiPackage className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Packaging</h4>
                <p className="text-gray-600">{product.specifications.packaging}</p>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
              <FiShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Description & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Product Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Certifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-green-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaLeaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Organic Certified</h3>
                    <p className="text-sm text-gray-600">USDA Organic</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-green-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Sustainable Farming</h3>
                    <p className="text-sm text-gray-600">Regenerative Practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-12">Customer Experiences</h2>
          
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {product.reviews.map((review, index) => (
              <div key={index} className="p-6 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                      {review.username[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800">{review.username}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array(5).fill().map((_, i) => (
                      <FiStar key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="border-t pt-12">
            <h3 className="text-3xl font-serif font-bold text-gray-800 mb-8">Share Your Experience</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-8 max-w-2xl">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-4">Your Rating</label>
                <div className="flex gap-2">
                  {Array(5).fill().map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewReviewRating(ratingValue)}
                        className={`p-3 rounded-lg transition-all ${
                          ratingValue <= newReviewRating 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-400 hover:bg-green-100'
                        }`}
                      >
                        <FiStar className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-4">Your Review</label>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  rows="4"
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Share your honest thoughts about this product..."
                />
              </div>
              
              <button
                type="submit"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-transform hover:scale-105"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
