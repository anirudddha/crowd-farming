import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import '../styles/CampaignDetails.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleInvest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/campaigns/${id}/raisedAmount`, {
        amount: parseFloat(investmentAmount),
        userId: id,
      });

      await axios.post(
        `http://localhost:5000/api/campaigns/${id}/investment`,
        { amount: parseFloat(investmentAmount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      alert('Investment successful!');
      setInvestmentAmount('');
    } catch (error) {
      console.error('Error investing:', error);
      alert('Investment failed!');
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="campaign-details-container">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : campaign ? (
        <div className="campaign-details-card">
          <h2 className="campaign-title">{campaign.campaignTitle}</h2>
          <p className="campaign-description">{campaign.description}</p>
          <div className="campaign-info">
            <div className="info-container">
              <h3>Farmer Details</h3>
              <p><strong>Name:</strong> {campaign.farmerName}</p>
              <p><strong>Phone:</strong> {campaign.phoneNumber}</p>
              <p><strong>Email:</strong> {campaign.email}</p>
            </div>
            <div className="info-container">
              <h3>Farm Details</h3>
              <p><strong>Name:</strong> {campaign.farmName}</p>
              <p><strong>Location:</strong> {campaign.farmLocation}</p>
              <p><strong>Size:</strong> {campaign.farmSize}</p>
              <p><strong>Crop Types:</strong> {campaign.cropTypes}</p>
              <p><strong>Farming Methods:</strong> {campaign.farmingMethods}</p>
            </div>
            <div className="info-container">
              <h3>Campaign Details</h3>
              <p><strong>Funding Goal:</strong> ${campaign.fundingGoal}</p>
              <p><strong>Min Investment:</strong> ${campaign.minInvestment}</p>
              <p><strong>Expected Returns:</strong> {campaign.expectedReturns}</p>
              <p><strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
              <p><strong>Fund Usage:</strong> {campaign.fundUsage}</p>
              <p><strong>Impact Metrics:</strong> {campaign.impactMetrics}</p>
              <p><strong>Raised Amount:</strong> ${campaign.raisedAmount}</p>
            </div>
          </div>

          <div className="campaign-images">
            <Slider {...carouselSettings}>
              {campaign.visuals && campaign.visuals.map((visual, index) => (
                <div key={index}>
                  <img
                    src={visual}
                    alt={`Campaign Visual ${index}`}
                    className="campaign-image"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <form onSubmit={handleInvest} className="investment-form">
            <input
              type="number"
              placeholder="Enter amount to invest"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              required
              className="investment-input"
            />
            <button type="submit" className="invest-button">Invest Now</button>
          </form>
        </div>
      ) : ( 
        <p className="error-text">Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetails;
