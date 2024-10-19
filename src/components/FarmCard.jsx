import React from 'react';
import { Link } from 'react-router-dom';

const FarmCard = ({ farm }) => {
  return (
    <div className="farm-card">
      <h2>{farm.name}</h2>
      <p>{farm.description}</p>
      <p>Target Amount: ${farm.targetAmount}</p>
      <p>Raised Amount: ${farm.raisedAmount}</p>
      <p>Location: {farm.location}</p>
      <Link to={`/campaign/${farm._id}`}>View Campaign</Link>
    </div>
  );
};

export default FarmCard;
