import React, { useState, useRef, useEffect } from 'react';

const StoreItemCard = ({ item }) => {
  const [selectedWeight, setSelectedWeight] = useState(item.weights[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#f8f9fa] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-transform duration-300 max-w-full md:max-w-[300px] w-full my-4 mx-auto relative border border-[rgba(139,94,52,0.1)] overflow-visible">
      {/* Product Image Section */}
      <div className="relative h-[160px] md:h-[180px] lg:h-[220px] bg-white p-2 md:p-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
        {item.isOrganic && (
          <div className="absolute top-[10px] left-[10px] bg-[#2d6a4f] text-white px-[12px] py-[6px] rounded-[20px] text-[0.75rem] font-semibold uppercase">
            Organic Certified
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-2 md:p-4 bg-gradient-to-b from-white to-[#f8f9fa]">
        <h3 className="text-center text-[#8b5e34] text-[0.9rem] md:text-[1rem] lg:text-[1.2rem] mb-2 font-serif">
          {item.name}
        </h3>
        <div className="flex items-center justify-center gap-[5px] text-[#2d6a4f] text-[0.75rem] md:text-[0.8rem] lg:text-[0.9rem] mb-4">
          <span>🌾</span>
          {item.farmName}
        </div>
        <div className="flex items-baseline justify-center gap-[3px] md:gap-[5px] lg:gap-2 mb-4">
          <span className="text-[1rem] md:text-[1.2rem] lg:text-[1.4rem] text-[#8b5e34] font-bold">
            ₹{item.price}/kg
          </span>
          {item.originalPrice && (
            <span className="text-[#a5a5a5] line-through text-[0.75rem] md:text-[0.8rem] lg:text-[0.9rem]">
              ₹{item.originalPrice}/kg
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-[3px] md:gap-[5px] lg:gap-2 mb-4">
          {item.isFresh && (
            <span className="px-[10px] py-1 rounded-[12px] text-[0.75rem] font-semibold text-center min-w-[70px] bg-[rgba(45,106,79,0.1)] text-[#2d6a4f] border border-[#2d6a4f]">
              Daily Fresh
            </span>
          )}
          {item.isJaggery && (
            <span className="px-[10px] py-1 rounded-[12px] text-[0.75rem] font-semibold text-center min-w-[70px] bg-[rgba(139,94,52,0.1)] text-[#8b5e34] border border-[#8b5e34]">
              Pure Jaggery
            </span>
          )}
        </div>

        {/* Custom Weight Dropdown */}
        <div
          className="relative w-full max-w-[200px] mx-auto my-3 text-center"
          ref={dropdownRef}
        >
          <button
            className="w-full px-[14px] py-[10px] text-base font-semibold bg-white border-2 border-[#2d6a4f] rounded-lg text-[#2d6a4f] cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#2d6a4f] hover:text-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedWeight}kg ▼
          </button>
          {dropdownOpen && (
            <ul className="absolute top-full left-1/2 transform -translate-x-1/2 w-full bg-white border-2 border-[#2d6a4f] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] mt-1 z-10 overflow-y-auto max-h-[150px] transition-opacity duration-300 ease-in-out">
              {item.weights.map((weight) => (
                <li
                  key={weight}
                  className="px-[10px] py-[10px] text-base cursor-pointer text-[#2d6a4f] text-center transition-colors duration-200 ease-in-out hover:bg-[#2d6a4f] hover:text-white"
                  onClick={() => {
                    setSelectedWeight(weight);
                    setDropdownOpen(false);
                  }}
                >
                  {weight}kg
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add to Cart Section */}
        <div className="mt-4">
          <button className="w-full bg-[#2d6a4f] text-white border-0 py-2 md:py-2.5 lg:py-3 rounded-lg text-[0.85rem] md:text-[0.9rem] lg:text-base cursor-pointer transition-colors duration-200 ease-in-out flex items-center justify-center gap-2 hover:bg-[#245c43]">
            <span className="text-xl">🛒</span>
            Add {selectedWeight}kg to Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;
