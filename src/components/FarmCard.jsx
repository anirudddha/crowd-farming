import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmCard.css'; // Import the CSS file

const FarmCard = ({ farm }) => {
  return (
    <div className="farm-card">
      <h2>{farm.name}</h2>
      <p>{farm.description}</p>
      <p><strong>Target Amount:</strong> ${farm.targetAmount}</p>
      <p><strong>Raised Amount:</strong> ${farm.raisedAmount}</p>
      <p><strong>Location:</strong> {farm.location}</p>
      <Link to={`/campaign/${farm._id}`}>View Campaign</Link>
    </div>
  );
};

export default FarmCard;
