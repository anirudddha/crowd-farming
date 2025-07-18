import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Truck, Sprout, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { decrease, increase } from '../../redux/globalStates';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CartPage = () => {
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // --- FIXED: State management aligned with new API response ---
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [pageLoading, setPageLoading] = useState(true); // For initial load
  const endPoint = `${endpoint}/cart`;

  const hancleSecureCheckout = () => navigate('checkOut');

  const fetchCartItems = useCallback(async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(endPoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // --- FIXED: Directly use the structured data from the backend ---
      const { items, summary } = response.data.data;

      // The backend now sends perfectly formatted items. No complex transformation is needed.
      const transformedItems = items.map(item => ({
        id: item.id,
        cartItemId: item.cartItemId,
        image: item.image, // Directly use the image URL string
        title: item.name,
        size: item.size,
        description: `${item.farmName} - ${item.category}`,
        price: item.price, // Directly use the price for the selected variant
        quantity: item.quantity,
      }));

      setCartItems(transformedItems);
      setSummary(summary);
      localStorage.setItem('cachedCart', JSON.stringify({ items: transformedItems, summary }));
    } catch (error) {
      console.error("Error fetching cart items", error);
      const cached = localStorage.getItem('cachedCart');
      if (cached) {
        const { items, summary } = JSON.parse(cached);
        setCartItems(items);
        setSummary(summary);
      }
    } finally {
      setPageLoading(false);
    }
  }, [token, endPoint]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemove = useCallback(async (product) => {
    try {
      // The payload is correct: the backend DELETE route expects itemId and size
      await axios.delete(endPoint, {
        headers: { Authorization: `Bearer ${token}` },
        data: { itemId: product.id, size: product.size }
      });
      dispatch(decrease());
      fetchCartItems(); // Refetch to get updated totals from the backend
    } catch (e) {
      console.error(e);
    }
  }, [token, endPoint, dispatch, fetchCartItems]);

  const handleDecrease = useCallback(async (id, size, quantity) => {
    if (quantity <= 1) return; // Prevent going below 1
    const key = `${id}_${size}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));

    try {
      // Optimistically update UI
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );

      await Promise.all([
        axios.put(endPoint, {
          itemId: id,
          size: size.toString(),
          quantity: quantity - 1
        }, { headers: { Authorization: `Bearer ${token}` } }),
        delay(400)
      ]);
      dispatch(decrease());
      fetchCartItems(); // Refetch to ensure data consistency
    } catch (e) {
      console.error(e);
      // Revert optimistic update on error
      fetchCartItems();
    } finally {
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  }, [token, endPoint, dispatch, fetchCartItems]);

  const handleIncrease = useCallback(async (id, size, quantity) => {
    const key = `${id}_${size}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      // Optimistic update
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
        }, { headers: { Authorization: `Bearer ${token}` } }),
        delay(400)
      ]);
      dispatch(increase());
      fetchCartItems(); // Refetch to ensure data consistency
    } catch (e) {
      console.error(e);
      fetchCartItems();
    } finally {
      setLoadingItems(prev => ({ ...prev, [key]: false }));
    }
  }, [token, endPoint, dispatch, fetchCartItems]);

  // --- FIXED: Use summary state for calculations ---
  const subtotal = summary ? summary.subtotal : 0;
  const shipping = subtotal > 75 ? 0 : 7.50;
  const total = subtotal + shipping;

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Your Basket is Empty!</h2>
            <p className="text-gray-600 mt-4">
              It looks like you haven’t added any fresh produce yet.
            </p>
            <a href="/shop" className="mt-6 inline-block bg-emerald-600 text-white px-8 py-3 rounded hover:bg-emerald-700 transition-colors">
              Start Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Organic Basket</h1>
            <p className="text-gray-600">Review your selection of farm-fresh produce</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => {
                const key = `${item.id}_${item.size}`;
                return (
                  <div key={item.cartItemId} onClick={() => navigate(`/shop/itemInfo/${item.id}`)} className="cursor-pointer bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image} // FIXED: Now a direct string URL
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
                          <button onClick={(e) => { e.stopPropagation(); setItemToDelete(item); }} className="text-gray-400 hover:text-red-500 transition-colors">
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
                                <button onClick={(e) => { e.stopPropagation(); handleDecrease(item.id, item.size, item.quantity); }} className="px-3 py-2 text-gray-600 hover:text-gray-800" disabled={item.quantity <= 1}>-</button>
                                <span className="px-3">{item.quantity}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleIncrease(item.id, item.size, item.quantity); }} className="px-3 py-2 text-gray-600 hover:text-gray-800">+</button>
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              <span>₹</span>{item.price.toFixed(2)} / unit
                            </div>
                          </div>
                          <span className="text-lg font-medium text-emerald-600">
                            <span>₹</span>{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Trust Badges remain the same */}
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({summary?.totalItems || 0} items)</span>
                    <span className="font-medium text-gray-900"><span>₹</span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        {subtotal > 75 ? 'FREE' : 'Standard'}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900"><span>₹</span>{shipping.toFixed(2)}</span>
                  </div>
                  {subtotal > 0 && subtotal <= 75 && (
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-emerald-700">
                        Spend <span>₹</span>{(75 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-emerald-600"><span>₹</span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={hancleSecureCheckout} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Secure Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-lg font-semibold text-gray-900">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to remove this item from your cart?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
              <button onClick={async () => { await handleRemove(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;