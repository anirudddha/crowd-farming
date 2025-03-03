import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import PropTypes from 'prop-types';

const StoreItemCard = ({ item }) => {
  const [selectedWeight, setSelectedWeight] = useState(item.weights[0]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsAddingToCart(false);
  };

  const calculateDiscount = () => {
    if (!item.originalPrice) return 0;
    return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  };

  const totalPrice = (item.price * selectedWeight).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto border border-gray-100 relative group"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] p-4 bg-white border-b border-gray-200 rounded-t-xl overflow-hidden">
        {item.isOrganic && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
            <FaLeaf /> Organic
          </div>
        )}
        {item.originalPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            {calculateDiscount()}% OFF
          </div>
        )}
        <img
          src={item.image}
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
          <span className="text-xl font-bold text-gray-900">₹{item.price}/kg</span>
          {item.originalPrice && (
            <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}/kg</span>
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

        {/* Weight Selector */}
        <div className="flex flex-wrap gap-2">
          {item.weights.map(weight => (
            <button
              key={weight}
              onClick={() => setSelectedWeight(weight)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedWeight === weight
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {weight} kg
            </button>
          ))}
        </div>

        {/* Total Price */}
        <p className="text-lg font-semibold text-gray-800">Total: ₹{totalPrice}</p>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
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
              Add {selectedWeight}kg
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

StoreItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    farmName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    weights: PropTypes.arrayOf(PropTypes.number).isRequired,
    isOrganic: PropTypes.bool,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default StoreItemCard;