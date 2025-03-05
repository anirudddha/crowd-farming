import React, { useEffect, useState } from 'react';
import { FiStar, FiShoppingCart, FiClock, FiPackage } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  // Reviews are hardcoded for now. Later, you can fetch these from the backend.
  const hardcodedReviews = [
    { username: "johndoe", rating: 4, comment: "Great quality and packaging!" },
    { username: "janedoe", rating: 5, comment: "Absolutely love it, will buy again." },
    { username: "marksmith", rating: 4.5, comment: "Impressed with the organic certification." }
  ];

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
            type: "image",
            url: fetchedProduct.images && fetchedProduct.images[0] ? fetchedProduct.images[0] : ""
          });
          setSelectedWeight(
            fetchedProduct.weights && fetchedProduct.weights.length > 0
              ? fetchedProduct.weights[0]
              : null
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading product details...</p>
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
              {selectedMedia && selectedMedia.type === "image" ? (
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
                  <source src={selectedMedia ? selectedMedia.url : ""} type="video/mp4" />
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
                    onClick={() => setSelectedMedia({ type: "image", url: mediaUrl })}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                      selectedMedia && selectedMedia.url === mediaUrl
                        ? "border-green-500 scale-110 shadow-lg"
                        : "border-white hover:border-green-200"
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
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating) ? "fill-current" : ""
                        }`}
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
              <div className="flex gap-3">
                {product.weights &&
                  product.weights.map((weight, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        selectedWeight === weight
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-white text-gray-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {weight} kg
                    </button>
                  ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4">
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
                    product.variants.map((variant) => variant.size).join(", ")}
                </p>
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
              {product.brand}
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
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <h2 className="text-4xl font-serif font-bold text-gray-800 mb-12">Customer Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {hardcodedReviews.map((review, index) => (
              <div key={index} className="p-6 bg-green-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                      {review.username[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800">{review.username}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-5 h-5 ${i < Math.round(review.rating) ? "fill-current" : ""}`}
                        />
                      ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
          {/* Placeholder for future review form */}
          <p className="text-xl text-gray-600">Review submission coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
