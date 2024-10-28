import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmCard.css'; // Import the CSS file

const FarmCard = ({ farm }) => {
  // Use a placeholder image if no valid image is available
  let placeholderImage = 'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg';

  // Determine the image source, fallback to placeholder if the image is not valid or base64 string
  if(farm.visuals[0]){
    placeholderImage = farm.visuals[0];
  }

  return (
    <div className="farm-card">
      <img 
        src={placeholderImage} 
        alt={farm.farmName} 
        className="farm-image" 
      />
      <div className="farm-content">
        <h3 className="farm-name">{farm.farmName}</h3>
        <p className="farm-description">Descripton: {farm.impactMetrics || 'No description available.'}</p>
        <div className="farm-details">
          <span className="farm-location">📍 {farm.farmLocation}</span>
          <span className="farm-target">🎯 Target: ${farm.fundingGoal}</span>
        </div>
        <Link to={`/campaign/${farm._id}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FarmCard;
