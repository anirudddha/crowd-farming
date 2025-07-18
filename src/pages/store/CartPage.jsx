import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Truck, Sprout, XCircle, Loader, ArrowRight } from 'lucide-react';
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

  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const endPoint = `${endpoint}/cart`;

  const hancleSecureCheckout = () => navigate('checkOut');

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(endPoint, { headers: { Authorization: `Bearer ${token}` } });
      const { items, summary } = response.data.data;
      const transformedItems = items.map(item => ({
        id: item.id, cartItemId: item.cartItemId, image: item.image, title: item.name, size: item.size, description: `${item.farmName} - ${item.category}`, price: item.price, quantity: item.quantity,
      }));
      setCartItems(transformedItems);
      setSummary(summary);
    } catch (error) { 
      console.error("Error fetching cart items", error); 
    }
  }, [token, endPoint]);

  useEffect(() => {
    const initialLoad = async () => {
        setPageLoading(true);
        await fetchCartItems();
        setPageLoading(false);
    }
    initialLoad();
  }, [fetchCartItems]);

  const handleRemove = useCallback(async (product) => {
    try {
      await axios.delete(endPoint, { headers: { Authorization: `Bearer ${token}` }, data: { itemId: product.id, size: product.size } });
      dispatch(decrease());
      fetchCartItems();
    } catch (e) { console.error(e); }
  }, [token, endPoint, dispatch, fetchCartItems]);

  const handleDecrease = useCallback(async (id, size, quantity) => {
    if (quantity <= 1) return;
    const key = `${id}_${size}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      setCartItems(prevItems => prevItems.map(item => item.id === id && item.size === size ? { ...item, quantity: item.quantity - 1 } : item));
      await Promise.all([
        axios.put(endPoint, { itemId: id, size: size.toString(), quantity: quantity - 1 }, { headers: { Authorization: `Bearer ${token}` } }),
        delay(400)
      ]);
      dispatch(decrease());
      fetchCartItems();
    } catch (e) { console.error(e); fetchCartItems(); } 
    finally { setLoadingItems(prev => ({ ...prev, [key]: false })); }
  }, [token, endPoint, dispatch, fetchCartItems]);

  const handleIncrease = useCallback(async (id, size, quantity) => {
    const key = `${id}_${size}`;
    setLoadingItems(prev => ({ ...prev, [key]: true }));
    try {
      setCartItems(prevItems => prevItems.map(item => item.id === id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item));
      await Promise.all([
        axios.put(endPoint, { itemId: id, size: size.toString(), quantity: quantity + 1 }, { headers: { Authorization: `Bearer ${token}` } }),
        delay(400)
      ]);
      dispatch(increase());
      fetchCartItems();
    } catch (e) { console.error(e); fetchCartItems(); } 
    finally { setLoadingItems(prev => ({ ...prev, [key]: false })); }
  }, [token, endPoint, dispatch, fetchCartItems]);

  const subtotal = summary ? summary.subtotal : 0;
  const shipping = subtotal > 75 ? 0 : 7.50;
  const total = subtotal + shipping;

  if (pageLoading) {
    return ( <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader className="w-12 h-12 animate-spin text-emerald-600" /></div> );
  }

  return (
    // FIX: Added `overflow-x-hidden` to the root element to prevent any horizontal scrollbars on mobile.
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pt-16">
             {/* FIX: Reduced padding on mobile (`p-6`) and added max-width to look better on tablet sizes. */}
             <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center w-full max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Basket is Empty!</h2>
              <p className="text-gray-600 mt-4">It looks like you haven’t added any fresh produce yet.</p>
              <a href="/shop" className="mt-6 inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold">Start Shopping</a>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Organic Basket</h1>
              <p className="text-gray-600">Review your selection of farm-fresh produce</p>
            </div>
            
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/*
                FIX: Added padding to the bottom (`pb-32`). This creates empty space at the end of the item list,
                ensuring the last item isn't hidden behind the fixed mobile checkout bar at the bottom of the screen.
                `lg:pb-0` removes this padding on large screens where the bar isn't present.
              */}
              <div className="lg:col-span-2 pb-32 lg:pb-0">
                <div className="space-y-4">
                  {cartItems.map(item => {
                    const key = `${item.id}_${item.size}`;
                    return (
                      // FIX: Reduced padding (`p-3`) and gap (`gap-3`) on small screens to prevent elements from being too cramped.
                      <div key={item.cartItemId} className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 flex gap-3 sm:gap-4 lg:gap-6 lg:shadow-sm transition-shadow hover:shadow-md">
                        {/* FIX: Reduced image size on small screens (`w-20 h-20`) to create more horizontal space for text and controls. */}
                        <img
                          src={item.image}
                          alt={item.title}
                          onClick={() => navigate(`/shop/itemInfo/${item.id}`)}
                          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover rounded-lg cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                                <h3 onClick={() => navigate(`/shop/itemInfo/${item.id}`)} className="text-base lg:text-xl font-semibold text-gray-900 cursor-pointer">{item.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 hidden md:block">{item.description}</p>
                            </div>
                            <button onClick={() => setItemToDelete(item)} className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1 lg:mt-0 lg:-mr-0">
                              <XCircle size={22} />
                            </button>
                          </div>
                          <div className="flex-1 flex flex-col justify-end mt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {loadingItems[key] ? (
                                  // FIX: Made the loading spinner container narrower on small screens (`w-20`)
                                  <div className="flex items-center justify-center border rounded-lg h-10 w-20 sm:w-24"><Loader className="animate-spin w-5 h-5 text-gray-600" /></div>
                                ) : (
                                  <div className="flex items-center border rounded-lg">
                                    <button onClick={() => handleDecrease(item.id, item.size, item.quantity)} className="px-3 py-2 text-gray-600 hover:text-gray-800" disabled={item.quantity <= 1}>-</button>
                                    <span className="px-3">{item.quantity}</span>
                                    <button onClick={() => handleIncrease(item.id, item.size, item.quantity)} className="px-3 py-2 text-gray-600 hover:text-gray-800">+</button>
                                  </div>
                                )}
                              </div>
                              <span className="text-lg font-medium text-emerald-600">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden lg:block bg-white rounded-lg shadow-sm p-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                      <div className="p-3 bg-emerald-100 rounded-full"><Truck className="w-6 h-6 text-emerald-600" /></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Farm Direct Shipping</h4>
                        <p className="text-sm text-gray-600">Next-day delivery from our fields</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                      <div className="p-3 bg-emerald-100 rounded-full"><Sprout className="w-6 h-6 text-emerald-600" /></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Certified Organic</h4>
                        <p className="text-sm text-gray-600">USDA Organic Certified</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal ({summary?.totalItems || 0} items)</span><span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><div className="flex items-center gap-2"><span className="text-gray-600">Shipping</span><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{subtotal > 75 ? 'FREE' : 'Standard'}</span></div><span className="font-medium text-gray-900">₹{shipping.toFixed(2)}</span></div>
                  </div>
                  {subtotal > 0 && subtotal <= 75 && (<div className="bg-emerald-50 p-3 rounded-lg text-center mb-6"><p className="text-sm text-emerald-700">Spend <b>₹{(75 - subtotal).toFixed(2)}</b> more for free shipping!</p></div>)}
                  <div className="pt-4 border-t flex justify-between items-center"><span className="font-semibold text-gray-900 text-lg">Total</span><span className="font-semibold text-emerald-600 text-xl">₹{total.toFixed(2)}</span></div>
                  <button onClick={hancleSecureCheckout} className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"><ShieldCheck size={20} />Secure Checkout</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {cartItems.length > 0 && (
          // FIX: Added a semi-transparent background with a blur effect (`bg-white/80 backdrop-blur-sm`) for better visibility
          // when content scrolls underneath. Also added a `z-index` to ensure it stays on top of all other content.
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 py-3 z-20">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <div>
                      <span className="text-gray-600 text-sm">Total Price</span>
                      <p className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
                  </div>
                  {/* FIX: Slightly reduced button padding to make it fit better on smaller screens. */}
                  <button onClick={hancleSecureCheckout} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 sm:px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <span>Checkout</span><ArrowRight size={20} />
                  </button>
              </div>
          </div>
      )}

      {itemToDelete && (<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"><div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4"><h2 className="text-lg font-semibold text-gray-900">Confirm Removal</h2><p className="mt-2 text-gray-600">Are you sure you want to remove this item from your basket?</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium">Cancel</button><button onClick={async () => { await handleRemove(itemToDelete); setItemToDelete(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">Remove</button></div></div></div>)}
    </div>
  );
};

export default CartPage;