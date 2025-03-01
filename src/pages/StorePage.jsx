import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import ItemCard from '../components/StoreItemCard';

const StorePage = () => {
  const farmProducts = [
    {
      id: 1,
      name: 'Organic Whole Wheat Flour',
      price: 45,
      originalPrice: 55,
      farmName: 'Green Valley Farms',
      image: 'https://media.istockphoto.com/id/174429248/photo/fresh-vegetables.jpg?s=612x612&w=0&k=20&c=fxlgOIET7gKa8M3rwkV974aUfB0gVpWiJQwUoxA4dtQ=',
      weights: [1, 5, 10],
      isOrganic: true,
      rating: 4.8,
      reviews: 142,
      deliveryTime: '2-3 days'
    },
    {
      id: 2,
      name: 'Pure Cane Jaggery',
      price: 120,
      farmName: 'Sweet Cane Collective',
      image: 'https://media.istockphoto.com/id/174429248/photo/fresh-vegetables.jpg?s=612x612&w=0&k=20&c=fxlgOIET7gKa8M3rwkV974aUfB0gVpWiJQwUoxA4dtQ=',
      weights: [0.5, 1, 2],
      isOrganic: true,
      rating: 4.6,
      reviews: 89,
      deliveryTime: '1-2 days'
    },
    // Add more products...
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            AgroMarket
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <Link 
              to="/shop/cart"
              className="p-2 rounded-full hover:bg-gray-50 relative"
            >
              <FiShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 rounded-full">
                2
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full 
            flex items-center space-x-2 font-medium">
            <span>All Products</span>
          </button>
          {['Grains', 'Sweeteners', 'Flours', 'Spices'].map((category) => (
            <button 
              key={category} 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                text-gray-700 rounded-full transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {farmProducts.map((product) => (
            <ItemCard 
              key={product.id} 
              item={product}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm
                hover:bg-gray-100 transition-colors">
                <FiHeart className="w-5 h-5 text-gray-600" />
              </button>
            </ItemCard>
          ))}
        </div>

        {/* Quality Assurance */}
        <section className="mt-16 border-t border-gray-100 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                🌱
              </div>
              <h3 className="text-lg font-semibold">Certified Organic</h3>
              <p className="text-gray-600">Direct from trusted local farms</p>
            </div>
            
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                🚚
              </div>
              <h3 className="text-lg font-semibold">Fast Shipping</h3>
              <p className="text-gray-600">Next-day delivery available</p>
            </div>
            
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                💚
              </div>
              <h3 className="text-lg font-semibold">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">30-day returns policy</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p className="mb-2">© 2024 AgroMarket. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-green-600">Terms of Service</a>
            <a href="#" className="hover:text-green-600">Privacy Policy</a>
            <a href="#" className="hover:text-green-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorePage;