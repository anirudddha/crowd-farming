import React from 'react';
import '../styles/Home.css'; // Import the CSS file
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate('/farms'); // Navigate to Farm Listings page
  };

  return (
    <div className="home-container">
      <h2>Welcome to the Crowdfarming Platform</h2>
      <p>Empower farmers, connect with investors, and grow together!</p>

      <div className="features">
        <div className="feature">
          <h3>🌱 Empower Farmers</h3>
          <p>Support local farmers by funding their projects and watching them flourish.</p>
        </div>
        <div className="feature">
          <h3>💰 Connect with Investors</h3>
          <p>Invest in sustainable agriculture and help create a greener future.</p>
        </div>
        <div className="feature">
          <h3>🤝 Grow Together</h3>
          <p>Join a community of like-minded individuals passionate about sustainable farming.</p>
        </div>
      </div>

      <div className="call-to-action">
        <h3>Join Us Today!</h3>
        <p><Link to="/login"> SignIn</Link> up now to start making a difference.</p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default Home;
