import React, { useEffect, useState } from 'react';
import { FiStar, FiShoppingCart, FiClock, FiPackage } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const endPoint = "http://localhost:5000/api/cart";
  const token = localStorage.getItem('token'); // adjust key if needed


  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0); // rating selected by clicking stars
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Message state for feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        const fetchedProduct = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setProduct(fetchedProduct);
        if (fetchedProduct) {
          setSelectedMedia({
            type: 'image',
            url: fetchedProduct.images && fetchedProduct.images[0] ? fetchedProduct.images[0] : ''
          });
          setSelectedWeight(
            fetchedProduct.weights && fetchedProduct.weights.length > 0
              ? fetchedProduct.weights[0]
              : null
          );
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Toggle the review form
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
    setError('');
    setSuccessMsg('');
  };


  const handleAddToCart = async () => {
    try {
      console.log("selected weight = ",selectedWeight, typeof selectedWeight);
      const response = await axios.post(
        endPoint,
        {
          itemId: id, // Use proper case to match backend expectation
          size: selectedWeight.toString(),
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}`},
        }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  

  // Handler for review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic validation
    if (rating === 0 || comment.trim() === '') {
      setError('Please select a rating and add your comment.');
      return;
    }

    // Get JWT token from localStorage
    if (!token) {
      setError('You must be logged in to submit a review.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/items/${id}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check for specific statuses
      if (response.status === 201) {
        alert('You need to sign in before submitting a review.');
        return;
      }
      if (response.status === 202) {
        alert('You already submitted a review.');
        return;
      }
      // Update the product's reviews with the updated item from backend
      setProduct(response.data.item);
      // Reset form values
      setRating(0);
      setComment('');
      setSuccessMsg('Review added successfully!');
      // Optionally close the form
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review. Please try again.');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Media and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl shadow-xl border-8 border-white bg-white overflow-hidden">
              {selectedMedia && selectedMedia.type === 'image' ? (
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
                  <source src={selectedMedia ? selectedMedia.url : ''} type="video/mp4" />
                </video>
              )}
              {/* Organic Badge */}
              {product.isOrganic && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <FaLeaf className="w-5 h-5" />
                  <span className="font-semibold">USDA Organic</span>
                </div>
              )}
            </div>
            {/* Thumbnail Carousel */}
            <div className="flex gap-4 px-8">
              {product.images &&
                product.images.map((mediaUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia({ type: 'image', url: mediaUrl })}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition-all duration-300 ${selectedMedia && selectedMedia.url === mediaUrl
                        ? 'border-green-500 scale-110 shadow-lg'
                        : 'border-white hover:border-green-200'
                      }`}
                  >
                    <img
                      src={mediaUrl}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
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
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : ''}`}
                      />

                    ))}
                </div>
              </div>
              <h1 className="text-5xl font-serif font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                From {product.farmName}
              </p>
            </div>
            {/* Pricing */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-green-700">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {/* Weight Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.weights &&
                  product.weights.map((weight, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedWeight === weight
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                      {weight} kg
                    </button>
                  ))}
              </div>
            </div>
            {/* Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50">
                <FiClock className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Delivery Time</h4>
                <p className="text-gray-600">{product.deliveryTime}</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-green-50">
                <FiPackage className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Available Variants</h4>
                <p className="text-gray-600">
                  {product.variants &&
                    product.variants.map((variant) => variant.size).join(', ')}
                </p>
              </div>
            </div>
            {/* Add to Cart */}
            <button className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
              onClick={handleAddToCart}>
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
              {product.brand}
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800">Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6 md:mb-12">Customer Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="p-4 md:p-6 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 md:w-10 h-8 md:h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm md:text-base">
                        {review.username ? review.username[0].toUpperCase() : 'U'}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm md:text-base">{review.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 md:w-5 h-4 md:h-5 ${i < Math.round(review.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-base md:text-lg text-gray-600">No reviews yet. Be the first to review!</p>
            )}
          </div>
          {/* Toggleable Review Submission Form */}
          <div className="w-full">
            <button
              onClick={toggleReviewForm}
              className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              {showReviewForm ? 'Cancel' : 'Add Your Review'}
            </button>
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <p className="text-lg font-medium mb-2">Select Rating:</p>
                  <div className="flex space-x-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => {
                        const starValue = i + 1;
                        return (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                          >
                            <FiStar
                              className={`w-8 h-8 ${starValue <= (hoverRating || rating)
                                ? 'fill-current text-amber-500'
                                : 'text-gray-400'
                                }`}
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>
                <textarea
                  name="comment"
                  placeholder="Your review"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  rows="4"
                ></textarea>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-lg transition-all"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
