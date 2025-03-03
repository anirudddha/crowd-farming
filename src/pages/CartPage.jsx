import React, { useState } from 'react';
import CartCard from '../components/CartCard';
import { ShieldCheck, Truck, Sprout, XCircle, ChevronDown } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1582515073490-39981397c445',
      title: 'Organic Seasonal Vegetables',
      description: 'Grown in our 5-acre organic farm with care and natural methods',
      price: 24.99,
      quantity: 1,
      origin: 'Field #3 - Picked today',
      harvestDate: 'Harvested: June 15, 2024'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11',
      title: 'Heritage Fruit Basket',
      description: 'Hand-picked organic fruits delivered straight from our fields',
      price: 38.50,
      quantity: 2,
      origin: 'Orchard Section B',
      harvestDate: 'Harvested: June 14, 2024'
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, Number(newQuantity)) } : item
    ));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 7.50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Organic Basket
          </h1>
          <p className="text-gray-600">
            Review your selection of farm-fresh produce
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    {/* <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded text-xs text-gray-700">
                      <p className="font-medium">{item.origin}</p>
                      <p className="text-xs">{item.harvestDate}</p>
                    </div> */}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {item.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <select
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="appearance-none border rounded-lg px-4 py-2 pr-8 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                          >
                            {[1,2,3,4,5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} / unit
                        </div>
                      </div>
                      <span className="text-lg font-medium text-emerald-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Truck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Farm Direct Shipping</h4>
                    <p className="text-sm text-gray-600">Next-day delivery from our fields</p>
                    <div className="mt-2 text-xs text-emerald-600">
                      Carbon neutral • Reusable packaging
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Sprout className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Certified Organic</h4>
                    <p className="text-sm text-gray-600">USDA Organic Certified</p>
                    <div className="mt-2 text-xs text-emerald-600">
                      Chemical-free • Sustainable practices
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      {subtotal > 75 ? 'FREE' : 'Standard'}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                
                {subtotal <= 75 && (
                  <div className="bg-emerald-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-emerald-700">
                      Spend ${(75 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Secure Checkout
              </button>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTjEGue1MO1jcmnO0FX4VrWRm2Ho2LwGHgpQ&s" 
                  className="w-5 h-5" 
                  alt="USDA Organic" 
                />
                <span>Certified Organic Operations</span>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help? Our farm team is here
                </p>
                <a href="tel:+11234567890" className="text-emerald-600 hover:underline font-medium">
                  (123) 456-7890
                </a>
                <p className="mt-3 text-xs text-gray-500">
                  Mon-Fri 8am-6pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;