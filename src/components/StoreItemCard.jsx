import React, { useState, useRef, useEffect } from 'react';
import '../styles/StoreItemCard.css'; // Ensure CSS is updated

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
    <div className="farm-product-card">
      <div className="product-image-container">
        <img src={item.image} alt={item.name} className="product-image" />
        {item.isOrganic && <div className="organic-badge">Organic Certified</div>}
      </div>

      <div className="product-details">
        <h3 className="product-title">{item.name}</h3>
        <div className="farm-origin">
          <span className="farm-icon">🌾</span>
          {item.farmName}
        </div>

        <div className="product-pricing">
          <span className="current-price">₹{item.price}/kg</span>
          {item.originalPrice && <span className="original-price">₹{item.originalPrice}/kg</span>}
        </div>

        <div className="quality-badges">
          {item.isFresh && <span className="fresh-badge">Daily Fresh</span>}
          {item.isJaggery && <span className="jaggery-badge">Pure Jaggery</span>}
        </div>

        {/* Custom Weight Dropdown */}
        <div className="custom-dropdown-container" ref={dropdownRef}>
          <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {selectedWeight}kg ▼
          </button>
          {dropdownOpen && (
            <ul className="dropdown-list">
              {item.weights.map(weight => (
                <li
                  key={weight}
                  className="dropdown-item"
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

        <div className="add-to-cart-section">
          <button className="farm-cart-button">
            <span className="cart-icon">🛒</span>
            Add {selectedWeight}kg to Basket
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;
