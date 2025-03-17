import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import toast from 'react-hot-toast';

const endPoint = "http://localhost:5000/api/cart";

const StoreItemCard = ({ item }) => {
  console.log(item);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Set default variant to first available variant or fallback to first variant
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants.find(variant => variant.available) || item.variants[0]
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (id) => {
    setIsAddingToCart(true);
    try {
      console.log("selected variant =", selectedVariant, typeof selectedVariant);
      const response = await axios.post(
        endPoint,
        {
          itemId: id,
          size: selectedVariant.size,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Item added to cart! 🛒");
    } catch (e) {
      console.log(e);
      toast.error("Failed to add item. Try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to the details page with the product id
    navigate(`/shop/itemInfo/${item._id}`);
  };

  const calculateDiscount = () => {
    if (!selectedVariant.originalPrice) return 0;
    return Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100);
  };

  // Use the selected variant's price for total price
  const totalPrice = selectedVariant ? selectedVariant.price.toFixed(2) : item.price.toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto border border-gray-100 relative group cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] p-4 bg-white border-b border-gray-200 rounded-t-xl overflow-hidden">
        {item.isOrganic && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
            <FaLeaf /> Organic
          </div>
        )}
        {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            {calculateDiscount()}% OFF
          </div>
        )}
        <img
          src={item.images && item.images.length > 0 ? item.images[0].url : "https://via.placeholder.com/150"}
          alt={item.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-md-2xl"
        />
      </div>

      {/* Product Details Section */}
      <div className="p-4 space-y-3">
        {/* Name and Rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
          <div className="flex items-center text-sm text-yellow-500">
            <FiStar className="mr-1" /> {item.rating}
          </div>
        </div>

        {/* Farm Name */}
        <p className="text-sm text-gray-600 truncate">{item.farmName}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">₹{selectedVariant ? selectedVariant.price : item.price}</span>
          {selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price && (
            <span className="text-gray-400 line-through text-sm">₹{selectedVariant.originalPrice}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags?.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Variant Selector */}
        <div className="flex flex-wrap gap-2">
          {item.variants.map(variant => (
            <button
              key={variant._id}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card navigation when selecting a variant
                setSelectedVariant(variant);
              }}
              disabled={!variant.available}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedVariant._id === variant._id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${!variant.available && 'opacity-50 cursor-not-allowed'}`}
            >
              {variant.size}
            </button>
          ))}
        </div>

        {/* Total Price */}
        <p className="text-lg font-semibold text-gray-800">Total: ₹{totalPrice}</p>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(item._id);
          }}
          disabled={isAddingToCart}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isAddingToCart ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <FiShoppingCart className="text-lg" />
              Add {selectedVariant.size}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

StoreItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        public_id: PropTypes.string.isRequired,
      })
    ),
    farmName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    weights: PropTypes.arrayOf(PropTypes.number),
    isOrganic: PropTypes.bool,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        available: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default StoreItemCard;
