import React from 'react';
import { useParams } from 'react-router-dom';

const CampaignDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Campaign Details - {id}</h2>
      <p>Details about the campaign will go here.</p>
    </div>
  );
};

export default CampaignDetails;
