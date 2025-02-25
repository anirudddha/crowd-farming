import React from 'react';
import ItemCard from '../components/StoreItemCard';
import '../styles/StorePage.css'; // We'll create this CSS file next

const StorePage = () => {
  const farmProducts = [
    {
      id: 1,
      name: 'Whole Wheat Flour',
      price: 45,
      originalPrice: 55,
      farmName: 'Green Valley Farms',
      image: 'https://media.istockphoto.com/id/174429248/photo/fresh-vegetables.jpg?s=612x612&w=0&k=20&c=fxlgOIET7gKa8M3rwkV974aUfB0gVpWiJQwUoxA4dtQ=',
      weights: [1, 5, 10],
      isOrganic: true,
      isFresh: true
    },
    {
      id: 2,
      name: 'Organic Jaggery',
      price: 120,
      farmName: 'Sweet Cane Collective',
      image: 'https://media.istockphoto.com/id/174429248/photo/fresh-vegetables.jpg?s=612x612&w=0&k=20&c=fxlgOIET7gKa8M3rwkV974aUfB0gVpWiJQwUoxA4dtQ=',
      weights: [0.5, 1, 2],
      isOrganic: true,
      isJaggery: true
    },
    // Add more farm products...
  ];

  return (
    <div className="farm-store-container">
      <header className="farm-header">
        <h1>Farm Fresh Pantry</h1>
        <p className="tagline">Direct from Local Farms to Your Kitchen</p>
      </header>

      <nav className="product-categories">
        <button className="category-btn active">All Grains</button>
        <button className="category-btn">Sweeteners</button>
        <button className="category-btn">Flours</button>
        <button className="category-btn">Spices</button>
      </nav>

      <div className="product-grid">
        {farmProducts.map(product => (
          <ItemCard key={product.id} item={product} />
        ))}
      </div>
    </div>
  );
};

export default StorePage;