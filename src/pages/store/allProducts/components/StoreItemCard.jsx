import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiLoader } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { increase } from '../../../../redux/globalStates';
import SignInModal from './SignInModal';

const StoreItemCard = ({ item }) => {
  const endpoint = useSelector(state => state.endpoint.endpoint);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(
    item.variants.find(v => v.available) || item.variants[0]
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      setShowSignInModal(true);
      return;
    }
    if (!selectedVariant.available) return;

    setIsAddingToCart(true);
    try {
      await axios.post(`${endpoint}/cart`, {
        itemId: item._id,
        size: selectedVariant.size,
        quantity: 1,
        weight: selectedVariant.weight,
      }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(increase());
    } catch (e) {
      console.error("Failed to add to cart:", e);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCardClick = () => navigate(`/shop/itemInfo/${item._id}`);

  // Memoize discount calculation
  const discount = useMemo(() => {
    if (!selectedVariant.originalPrice || selectedVariant.originalPrice <= selectedVariant.price) return 0;
    return Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100);
  }, [selectedVariant]);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full mx-auto border border-gray-100 relative group cursor-pointer overflow-hidden
                   flex flex-row sm:flex-col"
      >
        {/* --- IMAGE SECTION --- */}
        <div className="relative flex-shrink-0 aspect-square bg-gray-50 w-32 sm:w-full">
          <img
            src={item.images?.[0]?.url || 'https://via.placeholder.com/300'}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold z-10">
              {discount}% OFF
            </div>
          )}
          {item.isOrganic && (
            <div className="absolute hidden md:block top-2 left-2 lg:flex items-center gap-1 bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm z-10">
              <FaLeaf /> Organic
            </div>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* --- TOP PART: Name, Farm, Price --- */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight pr-2 line-clamp-2 sm:line-clamp-1">{item.name}</h3>
              <div className="hidden sm:flex items-center text-sm text-amber-500 flex-shrink-0">
                <FiStar className="mr-1 fill-current" /> {item.rating?.toFixed(1) || 'N/A'}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{item.farmName}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">₹{selectedVariant.price}</span>
              {selectedVariant.originalPrice > selectedVariant.price && (
                <span className="text-gray-400 line-through text-sm">₹{selectedVariant.originalPrice}</span>
              )}
            </div>
          </div>

          {/* --- BOTTOM PART: Actions --- */}
          <div className="mt-2">
            {/* --- MOBILE ACTION BUTTONS (Visible on mobile only) --- */}
            <div className="sm:hidden">
              <div className="flex items-center gap-2">
                {/* --- MOBILE VARIANT SELECTOR --- */}
                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newVariant = item.variants.find(v => v._id === e.target.value);
                    if (newVariant) setSelectedVariant(newVariant);
                  }}
                  value={selectedVariant._id}
                  className="w-full text-xs border-gray-300 rounded-md py-2 px-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {item.variants.map(variant => (
                    <option key={variant._id} value={variant._id} disabled={!variant.available}>
                      {variant.size} {!variant.available ? '(Out of stock)' : ''}
                    </option>
                  ))}
                </select>
                {/* --- MOBILE ADD TO CART BUTTON --- */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedVariant.available}
                  className="p-2 bg-gray-800 text-white rounded-md disabled:bg-gray-400 flex-shrink-0"
                >
                  {isAddingToCart ? <FiLoader className="animate-spin h-5 w-5"/> : <FiShoppingCart className="h-5 w-5"/>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- DESKTOP ACTION PANEL (Slides up on hover, hidden on mobile) --- */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm
                        translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {item.variants.map(variant => (
                <button
                  key={variant._id}
                  onClick={(e) => { e.stopPropagation(); setSelectedVariant(variant); }}
                  disabled={!variant.available}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedVariant._id === variant._id ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant.available}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white px-4 py-2.5 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
            >
              {isAddingToCart ? <FiLoader className="animate-spin h-5 w-5"/> : <><FiShoppingCart /> Add to Cart</>}
            </button>
          </div>
        </div>
      </motion.div>

      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </>
  );
};

// PropTypes remain the same
StoreItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string, public_id: PropTypes.string })),
    farmName: PropTypes.string,
    isOrganic: PropTypes.bool,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    variants: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number,
      available: PropTypes.bool.isRequired,
      weight: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
};

export default StoreItemCard;