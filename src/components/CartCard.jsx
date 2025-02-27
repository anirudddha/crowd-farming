import React from 'react';

const CartCard = ({ id, image, title, description, price, quantity, onRemove, onQuantityChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 my-6 bg-white border border-gray-300 rounded-lg shadow transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      {/* Card Image */}
      <div className="relative flex-shrink-0 w-full md:w-[220px]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-56 md:h-[220px] object-cover rounded-lg border border-gray-100"
        />
        <span className="absolute bottom-2 left-2 bg-[#2d6a4f] text-white px-3 py-1 rounded text-xs font-medium uppercase">
          Organic Certified
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-xl text-[#1a4331] font-semibold tracking-tight">
            {title}
          </h3>
          <button 
            className="text-[#c44545] text-sm font-medium px-2 py-1 rounded transition-colors duration-200 hover:bg-[rgba(196,69,69,0.1)]"
            onClick={onRemove}
          >
            <i className="fa-solid fa-trash"></i> Remove
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-6">
          {description}
        </p>

        {/* Product Details */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Quantity Control */}
          <div className="flex items-center gap-2">
            <label htmlFor={`quantity-${id}`} className="text-sm text-gray-700 font-medium">
              Qty:
            </label>
            <select 
              id={`quantity-${id}`}
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded bg-white text-base transition-all duration-200 focus:outline-none focus:border-[#2d6a4f] focus:shadow-[0_0_0_2px_rgba(45,106,79,0.1)]"
            >
              {[...Array(10).keys()].map(num => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-400 line-through">
              ${(price * 1.2).toFixed(2)}
            </span>
            <span className="text-2xl text-[#2d6a4f] font-bold">
              ${price.toFixed(2)}
            </span>
            <span className="text-sm text-[#c44545] font-medium">
              (20% OFF)
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-center md:justify-start gap-2 text-[#2d6a4f] text-sm font-medium mt-4">
          <span className="text-lg">🚚</span>
          <span>FREE Delivery Tomorrow by 3 PM</span>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
