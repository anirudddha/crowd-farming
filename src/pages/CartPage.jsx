import React, { useState } from 'react';
import CartCard from '../components/CartCard';

const CartPage = () => {
  // Sample cart data. In a real project, this data might come from an API or global state.
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: 'https://www.dahu.bio/images/photos/agriculture/organic-product.jpg', // Replace with your product image
      title: 'Organic Fresh Veggies',
      description: 'Grown in our 5-acre organic farm with care and natural methods.',
      price: 12.99,
      quantity: 1,
    },
    {
      id: 2,
      image: 'https://www.researchdive.com/blogImages/Yk9Tbo5neY.jpeg',
      title: 'Organic Fresh Fruits',
      description: 'Hand-picked organic fruits delivered straight from our fields.',
      price: 15.49,
      quantity: 2,
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Number(newQuantity) } : item
    ));
  };

  // Calculate order totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.00; // e.g., free shipping for orders over $50
  const total = subtotal + shipping;

  return (
    <div className="p-5 md:p-10 bg-[#f0f6f0] text-gray-800">
      <h1 className="text-center mb-10 text-[2.5rem]">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-5 justify-center flex-wrap">
        {/* Cart Items Section */}
        <div className="w-full lg:w-[60%] bg-white p-5 border border-gray-300 rounded-lg">
          {cartItems.map(item => (
            <CartCard
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              price={item.price}
              quantity={item.quantity}
              onRemove={() => handleRemove(item.id)}
              onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
            />
          ))}
        </div>
        {/* Order Summary Section */}
        <div className="w-full lg:w-[30%] bg-white p-5 border border-gray-300 rounded-lg h-fit">
          <h2 className="text-[1.8rem] text-[#2E7D32] border-b-2 border-[#f0f6f0] pb-[10px]">
            Order Summary
          </h2>
          <div className="my-5 text-[1.1rem]">
            <div className="flex justify-between mb-[10px]">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-[10px]">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-300 pt-[10px] text-[1.2rem]">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-[#2E7D32] text-white py-4 text-[1.1rem] rounded cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#1b5e20]">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
