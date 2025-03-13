import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Truck, Sprout, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

// Helper function to return a promise that resolves after a given time (ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CartPage = () => {
  const token = localStorage.getItem('token');
  const [cartItems, setCartItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Loading state for quantity update operations per item (key: id_size)
  const [loadingItems, setLoadingItems] = useState({});
  const endPoint = "http://localhost:5000/api/cart";

  // Memoized fetch function
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(endPoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transformedItems = response.data.data.map(item => ({
        id: item._id,
        image: item.images[0],
        title: item.name,
        size: item.size,
        description: `${item.farmName} - ${item.category}`,
        price: item.price,
        quantity: item.quantity,
        origin: "",
        harvestDate: "",
      }));
      setCartItems(transformedItems);
      localStorage.setItem('cachedCartItems', JSON.stringify(transformedItems));
    } catch (error) {
      console.error("Error fetching cart items", error);
      const cached = localStorage.getItem('cachedCartItems');
      if (cached) {
        setCartItems(JSON.parse(cached));
      }
    }
  }, [token]);

  useEffect(() => {
    const cached = localStorage.getItem('cachedCartItems');
    if (cached) {
      setCartItems(JSON.parse(cached));
    }
    fetchCartItems();
  }, [fetchCartItems]);

  // Handler for removing an item
  const handleRemove = useCallback(async (id) => {
    try {
      console.log("Deleting item with id:", id);
      const response = await axios.delete(endPoint, {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId: id }
      });
      console.log(response);
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  // Handler for decreasing item quantity with loader that lasts at least 1 sec
  const handleDecrease = useCallback(async (id, size, quantity) => {
    const key = `${id}_${size}`;
    try {
      // Set loading for this item
      setLoadingItems(prev => ({ ...prev, [key]: true }));
      
      // Optimistically update UI
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
      );

      // Wait for both axios call and a minimum delay of 1 sec
      await Promise.all([
        axios.put(endPoint, {
          itemId: id,
          size: size.toString(),
          quantity: quantity - 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        delay(400)
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      // Clear loading state for this item
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  }, [token]);

  // Handler for increasing item quantity with loader that lasts at least 1 sec
  const handleIncrease = useCallback(async (id, size, quantity) => {
    const key = `${id}_${size}`;
    try {
      setLoadingItems(prev => ({ ...prev, [key]: true }));
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

      await Promise.all([
        axios.put(endPoint, {
          itemId: id,
          size: size.toString(),
          quantity: quantity + 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        delay(400)
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  }, [token]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 7.50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Organic Basket</h1>
          <p className="text-gray-600">Review your selection of farm-fresh produce</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => {
              const key = `${item.id}_${item.size}`;
              return (
                <div key={key} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setItemToDelete(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {loadingItems[key] ? (
                            <div className="flex items-center justify-center border rounded-lg w-20 h-10">
                              <Loader className="animate-spin w-5 h-5 text-gray-600" />
                            </div>
                          ) : (
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleDecrease(item.id, item.size, item.quantity)}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                              >
                                -
                              </button>
                              <span className="px-3">{item.quantity}</span>
                              <button
                                onClick={() => handleIncrease(item.id, item.size, item.quantity)}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                              >
                                +
                              </button>
                            </div>
                          )}
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
              );
            })}

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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
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
                <p className="text-sm text-gray-600 mb-2">Need help? Our farm team is here</p>
                <a href="tel:+11234567890" className="text-emerald-600 hover:underline font-medium">
                  (123) 456-7890
                </a>
                <p className="mt-3 text-xs text-gray-500">Mon-Fri 8am-6pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this item from your cart?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleRemove(itemToDelete);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
