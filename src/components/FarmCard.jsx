import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmCard.css'; // Import the CSS file

const FarmCard = ({ farm }) => {
  // Use a placeholder image if no image is available
  const placeholderImage = 'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg';

  return (
    <div className="farm-card">
      <img 
        src={farm.image || placeholderImage} 
        alt={farm.name} 
        className="farm-image" 
      />
      <div className="farm-content">
        <h3 className="farm-name">{farm.name}</h3>
        <p className="farm-description">{farm.description || 'No description available.'}</p>
        <div className="farm-details">
          <span className="farm-location">📍 {farm.location}</span>
          <span className="farm-target">🎯 Target: ${farm.targetAmount}</span>
        </div>
        <Link to={`/campaign/${farm._id}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FarmCard;
