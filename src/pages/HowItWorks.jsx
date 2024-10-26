import React, { useState } from 'react';
import '../styles/HowItWorks.css'; // Update CSS to new styles
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [faqOpen, setFaqOpen] = useState([false, false, false]);

  const toggleFaq = (index) => {
    const updatedFaqOpen = [...faqOpen];
    updatedFaqOpen[index] = !updatedFaqOpen[index];
    setFaqOpen(updatedFaqOpen);
  };

  return (
    <div className="how-it-works-container">
      <h2>How It Works</h2>
      <p className="intro-text">
        Learn how you can make an impact by supporting farms and getting returns on your investment.
      </p>

      <div className="steps-container">
        <div className="step">
          <div className="step-icon">💸</div>
          <h3>Fund the Farms</h3>
          <p>Choose a project, contribute, and help farmers grow their dreams.</p>
        </div>
        <div className="step">
          <div className="step-icon">🌱</div>
          <h3>Farm Flourishes</h3>
          <p>Once funded, farmers can grow crops, improve facilities, and increase sustainability.</p>
        </div>
        <div className="step">
          <div className="step-icon">📈</div>
          <h3>Enjoy Returns</h3>
          <p>Earn produce, profits, or reports on the environmental benefits you've contributed to.</p>
        </div>
      </div>

      <div className="investor-benefits">
        <h2>What Investors Get</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🎁</div>
            <h3>Unique Rewards</h3>
            <p>Receive fresh produce, farm tours, or even dividends from the farm's profits.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🌍</div>
            <h3>Environmental Impact</h3>
            <p>Your investment helps reduce CO2 emissions and promote sustainable farming practices.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h3>Transparency Reports</h3>
            <p>Get detailed reports on how your investment is being used and the impact it's creating.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item" onClick={() => toggleFaq(0)}>
          <div className="faq-question">What are the risks involved in investing?</div>
          {faqOpen[0] && <div className="faq-answer">Investments carry risk, but we aim to mitigate this by selecting sustainable, well-vetted farms.</div>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(1)}>
          <div className="faq-question">How do I receive my returns?</div>
          {faqOpen[1] && <div className="faq-answer">Depending on the project, returns may include produce, profits, or environmental impact reports.</div>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(2)}>
          <div className="faq-question">How do I choose which farm to support?</div>
          {faqOpen[2] && <div className="faq-answer">You can explore farms based on sustainability, environmental goals, and potential profits.</div>}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3>Ready to Make an Impact?</h3>
        <p>Join the movement and start supporting farmers today.</p>
        <Link to="/home" className="cta-button">Get Started</Link>
      </div>
    </div>
  );
};

export default HowItWorks;
