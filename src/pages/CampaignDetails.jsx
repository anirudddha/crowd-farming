import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CampaignDetails.css';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(response.data);
        // console.log(response.data);
        if (response.data.visuals && response.data.visuals.length > 0) {
          setSelectedImage(response.data.visuals[0]); // Default to the first image
        }
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


    if (campaign.minInvestment > investmentAmount) {
      alert(`Minimum ${campaign.minInvestment} Required`);
      return;
    }

    let a  = parseInt(campaign.raisedAmount, 10);
    let b = parseInt(campaign.fundingGoal,10);
    let c = parseInt(investmentAmount,10);
    if (c + a > b) {
      alert(`This Amount is Exceeding the Campaign Goal of Investment ${b}`);
      return;
    }


    try {
      await axios.put(`http://localhost:5000/api/campaigns/${id}/raisedAmount`, {
        amount: parseFloat(investmentAmount),
        userId: id,
        name: campaign.campaignTitle,
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

  return (
    <div className="campaign-details-container">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : campaign ? (
        <div className="campaign-details-card">
          <div className="card-content">
            {/* Left Section: Images */}
            <div className="campaign-images">
              <img
                src={selectedImage}
                alt="Selected Campaign Visual"
                className="selected-image"
              />
              <div className="thumbnail-container">
                {campaign.visuals &&
                  campaign.visuals.map((visual, index) => (
                    selectedImage != visual &&
                    <img
                      key={index}
                      src={visual}
                      alt={`Thumbnail ${index}`}
                      className={`thumbnail ${visual === selectedImage ? 'active' : ''}`}
                      onClick={() => setSelectedImage(visual)}
                    />
                  ))}
              </div>
            </div>

            {/* Right Section: Campaign Info */}
            <div className="campaign-info">
              <h2 className="campaign-title">{campaign.campaignTitle}</h2>
              <p className="campaign-description">{campaign.description}</p>

              <div className="info-section">
                <h3>Farmer Details</h3>
                <p><strong>Name:</strong> {campaign.farmerName}</p>
                <p><strong>Phone:</strong> {campaign.phoneNumber}</p>
                <p><strong>Email:</strong> {campaign.email}</p>
              </div>

              <div className="info-section">
                <h3>Farm Details</h3>
                <p><strong>Name:</strong> {campaign.farmName}</p>
                <p><strong>Location:</strong> {campaign.farmLocation}</p>
                <p><strong>Size:</strong> {campaign.farmSize}</p>
                <p><strong>Crop Types:</strong> {campaign.cropTypes}</p>
                <p><strong>Farming Methods:</strong> {campaign.farmingMethods}</p>
              </div>

              <div className="info-section">
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

              { parseInt(campaign.raisedAmount,10)+parseInt(campaign.minInvestment,10) <parseInt(campaign.fundingGoal,10) ?
                (<form onSubmit={handleInvest} className="investment-form">
                  <input
                    type="number"
                    placeholder="Enter amount to invest"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    required
                    className="investment-input"
                  />
                  <button type="submit" className="invest-button">Invest Now</button>
                </form>)
                :
                <button className="invest-button-full">Campgign is Full You Can't Invest in This Farm</button>
              }
            </div>
          </div>
        </div>
      ) : (
        <p className="error-text">Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetails;
