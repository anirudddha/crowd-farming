import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import StoreItemCard from '../components/StoreItemCard';
import Loader from '../components/Loader'; // Import your loader component
import axios from 'axios';

const StorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New state for cart items
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from localStorage on component mount
  useEffect(() => {

    const fetchNumber = async()=>{
      try {
        const token = localStorage.getItem('token');
        const endPoint = 'http://localhost:5000/api/cart';
        const response = await axios.get(endPoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.data.length);
        // console.log(response.data.data.length);
      }
      catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }
    
    fetchNumber();
  }, []);

  // Check for cached data in localStorage and then fetch updated data
  useEffect(() => {
    const cachedItems = localStorage.getItem('items');
    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
      // Even if we have cached items, we still fetch fresh data in the background
      setIsLoading(false);
    }

    axios.get('http://localhost:5000/api/items')
      .then(response => {
        // Extract the items array from the API response
        const fetchedItems = response.data.response;
        setItems(fetchedItems);
        // Update the localStorage cache with new data
        localStorage.setItem('items', JSON.stringify(fetchedItems));
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = ['All', 'Grains', 'Sweeteners', 'Flours', 'Spices'];

  // Memoize the category click handler
  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Memoize filtered items based on search query and selected category
  const filteredItems = useMemo(() => {
    return items.filter(product => {
      // Assuming product has 'category' and 'name' properties
      if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-green-700 transition-colors">
              AgroMarket
            </Link>
            <div className="flex items-center space-x-6">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search farm products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <Link 
                to="/shop/cart"
                className="p-2 relative text-gray-700 hover:text-green-700 transition-colors"
              >
                <FaShoppingCart className="w-6 h-6" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Product Grid or Loader */}
        {isLoading && items.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <StoreItemCard item={product} className="relative">
                    <button className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <FaHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </button>
                  </StoreItemCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Quality Assurance */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <FaLeaf className="w-6 h-6 text-green-600" />,
                title: "Certified Organic",
                text: "Sourced directly from certified farms"
              },
              {
                icon: <FaTruck className="w-6 h-6 text-green-600" />,
                title: "Fast Shipping",
                text: "Next-day delivery available"
              },
              {
                icon: <FaShieldAlt className="w-6 h-6 text-green-600" />,
                title: "Quality Guaranteed",
                text: "30-day satisfaction guarantee"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mx-auto mb-4 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
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
