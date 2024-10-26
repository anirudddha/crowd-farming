import React from 'react';
import '../styles/Home.css'; // Updated CSS file
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate('/farms'); // Navigate to Farm Listings page
  };

  return (
    <div className="homepage-wrapper">
      <section className="hero-section">
        <h1 className="hero-title">Join the Future of Sustainable Farming</h1>
        <p className="hero-subtitle">Empower farmers, invest in a greener future, and grow together!</p>
        <button className="hero-button" onClick={handleGetStarted}>Get Started</button>
      </section>

      <section className="impact-metrics">
        <h2>Our Impact So Far</h2>
        <div className="metrics-grid">
          <div className="metric-item">
            <h3>🌾 500+</h3>
            <p>Farmers Empowered</p>
          </div>
          <div className="metric-item">
            <h3>💼 1200+</h3>
            <p>Investors Engaged</p>
          </div>
          <div className="metric-item">
            <h3>🌍 10,000+</h3>
            <p>Tons of CO2 Offset</p>
          </div>
        </div>
      </section>

      <section className="top-farms">
        <h2>Top Farms to Invest In</h2>
        <div className="farm-cards">
          <div className="farm-card">
            <img src="farm1.jpg" alt="Farm 1" className="farm-image" />
            <h3>Green Valley Farm</h3>
            <p>Located in California, focusing on organic produce.</p>
          </div>
          <div className="farm-card">
            <img src="farm2.jpg" alt="Farm 2" className="farm-image" />
            <h3>Sunrise Plantation</h3>
            <p>Leading in sustainable coffee farming in Brazil.</p>
          </div>
          <div className="farm-card">
            <img src="farm3.jpg" alt="Farm 3" className="farm-image" />
            <h3>EcoLands</h3>
            <p>Innovating in eco-friendly livestock farming.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Community Says</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"Crowdfarming has revolutionized my business. I now have the funding and support I need!"</p>
            <p className="author">- John Doe, Farmer</p>
          </div>
          <div className="testimonial-card">
            <p>"Investing in sustainable agriculture has never felt this impactful. Great platform!"</p>
            <p className="author">- Jane Smith, Investor</p>
          </div>
        </div>
      </section>

      {/* <section className="newsletter-signup">
        <h3>Stay Updated</h3>
        <p>Join our newsletter to get the latest farm projects and impact stories straight to your inbox.</p>
        <form className="signup-form">
          <input type="email" placeholder="Enter your email" className="email-input" />
          <button className="signup-button" type="submit">Sign Up</button>
        </form>
      </section> */}
      <div className="how-it-works-link">
        <Link to="/how-it-works" className="how-it-works-button">
          Learn How It Works
        </Link>
      </div>
    </div>
  );
};

export default Home;
