import React, { useEffect, useState } from 'react';
import { FiStar, FiShoppingCart, FiClock, FiPackage, FiEdit3 } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { increase } from '../../redux/globalStates';

const ProductPage = () => {

  const endpoint = useSelector(state => state.endpoint.endpoint);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const token = localStorage.getItem('token');

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Message state for feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${endpoint}/items/${id}`);
        const fetchedProduct = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setProduct(fetchedProduct);
        if (fetchedProduct) {
          setSelectedMedia({
            type: 'image',
            url: fetchedProduct.images && fetchedProduct.images[0] ? fetchedProduct.images[0] : ''
          });
          if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
            const availableVariant = fetchedProduct.variants.find(variant => variant.available);
            setSelectedVariant(availableVariant || fetchedProduct.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error fetching product details.');
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

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${endpoint}/cart`,
        {
          itemId: id,
          size: selectedVariant ? selectedVariant.size : '',
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(increase());
      toast.success(
        <div className="flex items-center gap-2">
          <span>Item added to cart!</span>
          <Link to="/shop/cart" style={{ color: '#00b4d8', fontWeight: 'bold' }} className="flex items-center gap-1">
            <span>View Cart</span> <FiShoppingCart />
          </Link>
        </div>
      );

    } catch (e) {
      console.error(e);
      toast.error("Failed to add item to cart.");
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (rating === 0 || comment.trim() === '') {
      setError('Please select a rating and add your comment.');
      toast.error('Please select a rating and add your comment.');
      return;
    }

    if (!token) {
      setError('You must be logged in to submit a review.');
      toast.error('You must be logged in to submit a review.');
      return;
    }

    try {
      const response = await axios.put(
        `${endpoint}/items/${id}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        alert('You need to sign in before submitting a review.');
        return;
      }
      if (response.status === 202) {
        alert('You already submitted a review.');
        return;
      }
      setProduct(response.data.item);
      setRating(0);
      setComment('');
      setSuccessMsg('Review added successfully!');
      toast.success('Review added successfully!');
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error adding review:', err);
      setError('Failed to add review. Please try again.');
      toast.error('Failed to add review. Please try again.');
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Media and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Media Gallery */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3 mt-2">
              {product.images &&
                product.images.map((mediaUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMedia({ type: 'image', url: mediaUrl })}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-4 transition-all duration-300 ${selectedMedia && selectedMedia.url === mediaUrl
                      ? 'border-green-500 scale-110 shadow-lg'
                      : 'border-white hover:border-green-200'
                      }`}
                  >
                    <img
                      src={mediaUrl.url}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
            <div className="relative flex-1 aspect-square rounded-3xl shadow-xl border-8 border-white bg-white overflow-hidden">
              {selectedMedia && selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url.url}
                  alt={product.name}
                  className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <video controls className="w-full h-full object-cover" poster="/video-poster.jpg">
                  <source src={selectedMedia ? selectedMedia.url : ''} type="video/mp4" />
                </video>
              )}
              {product.isOrganic && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <FaLeaf className="w-5 h-5" />
                  <span className="font-semibold">USDA Organic</span>
                </div>
              )}
            </div>
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <div className="flex items-center text-amber-600">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FiStar key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                From {product.farmName}
              </p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-bold text-green-700">
                ₹{selectedVariant ? selectedVariant.price : product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-400 line-through">
                  ₹{selectedVariant ? selectedVariant.originalPrice : product.originalPrice}
                </span>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.available}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedVariant && selectedVariant.size === variant.size
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
                        } ${!variant.available && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  {product.variants && product.variants.map((variant) => variant.size).join(', ')}
                </p>
              </div>
            </div>
            <button
              className="w-full py-5 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-xl transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
              onClick={handleAddToCart}
            >
              <FiShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </div>
        </div>
        {/* Product Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-50">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-200">
            Product Details
          </h2>

          <div className="space-y-6">
            <div className="prose max-w-none text-gray-700">
              {product.description}
            </div>

            {product.ingredients && (
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                  <FaLeaf className="w-5 h-5" />
                  Ingredients
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {ingredient}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Essentials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Usage Guide */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <FiClock className="w-5 h-5" />
              Usage Guide
            </h3>
            <ul className="space-y-3">
              {product.usageInfo.map((usage, index) => (
                <li key={index} className="text-gray-700 pl-2 border-l-4 border-blue-100">
                  {usage}
                </li>
              ))}
            </ul>
          </div>

          {/* Storage Information */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-50">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-amber-600">
              <FiPackage className="w-5 h-5" />
              Storage Tips
            </h3>
            <div className="prose text-gray-700">
              {product.storageInfo}
            </div>
          </div>
        </div>

        {/* Health Benefits Section */}
        {product.benefits && (
          <div className="bg-green-50 p-8 rounded-2xl shadow-lg mb-12">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">
              Health Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-4 rounded-lg flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-green-600 rounded-full flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {product.faq && product.faq.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-green-50">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {product.faq.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-green-50 transition-colors">
                  <p className="font-semibold text-gray-800 mb-2">Q: {item.question}</p>
                  <p className="text-gray-700 pl-4 border-l-2 border-green-200">A: {item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Review Section */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-10 mb-16">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Review Summary */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Customer Experiences</h2>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-gray-900">{product.rating}/5</div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-5 h-5 ${i < product.rating ? 'text-amber-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">{product.reviews?.length} verified reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={toggleReviewForm}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center gap-3 transition-all"
                >
                  <FiEdit3 className="w-5 h-5" />
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
                <p className="text-sm text-gray-500 text-center">
                  Share your authentic experience with our community
                </p>
              </div>
            </div>

            {/* Review Form/List */}
            <div className="lg:w-2/3">
              {showReviewForm ? (
                <div className="bg-gray-50 rounded-xl p-8">
                  <form onSubmit={handleSubmitReview} className="space-y-8">
                    <div>
                      <label className="block text-lg font-medium mb-4">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-2 transition-all ${rating >= star ? 'scale-110' : 'hover:scale-105'}`}
                          >
                            <FiStar
                              className={`w-10 h-10 ${rating >= star ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-medium mb-4">Detailed Review</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="5"
                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="What makes this product stand out? How was your experience using it?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Publish Review
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  {product.reviews?.map((review, index) => (
                    <div key={index} className="pb-8 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                          {review.username?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-medium">{review.username || 'Anonymous'}</h4>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProductPage;
