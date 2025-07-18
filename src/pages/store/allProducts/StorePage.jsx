import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import StoreItemCard from './components/StoreItemCard';
import Loader from '../../../components/Loader'; // Assuming you have a Loader component
import axios from 'axios';
import { useSelector } from 'react-redux';

const StorePage = () => {
  const cartItemNumber = useSelector(state => state.cartCount.count);
  const endpoint = useSelector(state => state.endpoint.endpoint);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetching logic using localStorage for caching
  useEffect(() => {
    const cachedItems = localStorage.getItem('items');
    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
      setIsLoading(false); // Show cached data immediately
    }

    axios.get(`${endpoint}/items`)
      .then(response => {
        const fetchedItems = response.data.response;
        setItems(fetchedItems);
        localStorage.setItem('items', JSON.stringify(fetchedItems));
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      })
      .finally(() => {
        // Set loading to false only after fetch completes,
        // ensuring even cached users get the latest data without a flicker
        setIsLoading(false);
      });
  }, [endpoint]);

  const categories = ['All', 'Grains', 'Sweeteners', 'Flours', 'Spices'];

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Memoized filtering for performance
  const filteredItems = useMemo(() => {
    return items.filter(product => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.farmName?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- RESPONSIVE HEADER --- */}
      <nav className="bg-white shadow-sm sticky md:top-0 top-6 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stacks on mobile, becomes a row on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:h-20 sm:py-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-emerald-700 transition-colors">
              AgroMarket
            </Link>
            <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <Link
                to="/shop/cart"
                className="p-2 relative lg:hidden text-gray-700 hover:text-emerald-700 transition-colors"
                aria-label="View shopping cart"
              >
                <FaShoppingCart className="w-6 h-6" />
                {cartItemNumber > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center font-bold">
                    {cartItemNumber}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters with horizontal scroll */}
        <div className="mb-8">
          <div
            className="flex space-x-2 pb-2 -mx-4 px-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Changed to camelCase
          >            {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors text-sm whitespace-nowrap ${selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              {category}
            </motion.button>
          ))}
          </div>
        </div>

        {/* Product List/Grid or Loader/Empty State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader /></div>
        ) : filteredItems.length > 0 ? (
          // --- ADAPTIVE LAYOUT CONTAINER ---
          // A flex column on mobile (list) and a grid on desktop
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
            <AnimatePresence>
              {filteredItems.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StoreItemCard item={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
          </div>
        )}

        {/* Quality Assurance Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <FaLeaf className="w-6 h-6 text-emerald-600" />, title: "Certified Organic", text: "Sourced directly from certified farms" },
              { icon: <FaTruck className="w-6 h-6 text-emerald-600" />, title: "Fast Shipping", text: "Next-day delivery available" },
              { icon: <FaShieldAlt className="w-6 h-6 text-emerald-600" />, title: "Quality Guaranteed", text: "30-day satisfaction guarantee" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                className="p-6 bg-white rounded-xl shadow-sm transition-shadow"
              >
                <div className="mx-auto mb-4 w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default StorePage;