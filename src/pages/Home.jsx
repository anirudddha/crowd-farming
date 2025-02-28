import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/farms');
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto text-center bg-white rounded-lg">
      {/* Hero Section */}
      <section className="bg-[#e8ffe8] p-12 rounded-lg mb-8">
        <h1 className="text-[#388e3c] text-[2.5rem] font-bold mb-4">
          Join the Future of Sustainable Farming
        </h1>
        <p className="text-[#555] text-[1.2rem] mb-6">
          Empower farmers, invest in a greener future, and grow together!
        </p>
        <button 
          onClick={handleGetStarted} 
          className="bg-[#4caf50] text-white py-3 px-8 rounded text-base cursor-pointer transition duration-300 hover:bg-[#45a049]"
        >
          Get Started
        </button>
      </section>

      {/* Impact Metrics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Impact So Far</h2>
        <div className="flex flex-wrap justify-around">
          <div className="bg-[#e8f5e9] rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <h3 className="text-[#388e3c] text-2xl font-bold">🌾 500+</h3>
            <p>Farmers Empowered</p>
          </div>
          <div className="bg-[#e8f5e9] rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <h3 className="text-[#388e3c] text-2xl font-bold">💼 1200+</h3>
            <p>Investors Engaged</p>
          </div>
          <div className="bg-[#e8f5e9] rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <h3 className="text-[#388e3c] text-2xl font-bold">🌍 10,000+</h3>
            <p>Tons of CO2 Offset</p>
          </div>
        </div>
      </section>

      {/* Top Farms */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Farms to Invest In</h2>
        <div className="flex flex-wrap justify-around">
          <div className="bg-white rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <img 
              src="farm1.jpg" 
              alt="Farm 1" 
              className="w-full h-52 object-cover rounded mb-4" 
            />
            <h3 className="text-xl font-bold mb-2">Green Valley Farm</h3>
            <p>Located in California, focusing on organic produce.</p>
          </div>
          <div className="bg-white rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <img 
              src="farm2.jpg" 
              alt="Farm 2" 
              className="w-full h-52 object-cover rounded mb-4" 
            />
            <h3 className="text-xl font-bold mb-2">Sunrise Plantation</h3>
            <p>Leading in sustainable coffee farming in Brazil.</p>
          </div>
          <div className="bg-white rounded-lg p-6 m-4 w-full sm:w-1/2 md:w-1/3 shadow">
            <img 
              src="farm3.jpg" 
              alt="Farm 3" 
              className="w-full h-52 object-cover rounded mb-4" 
            />
            <h3 className="text-xl font-bold mb-2">EcoLands</h3>
            <p>Innovating in eco-friendly livestock farming.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What Our Community Says</h2>
        <div className="flex flex-wrap justify-around">
          <div className="bg-[#e0f7fa] p-6 rounded-lg m-4 w-full sm:w-1/2 shadow">
            <p>
              "5 Acre Farming has revolutionized my business. I now have the funding and support I need!"
            </p>
            <p className="text-[#555] italic mt-2">- John Doe, Farmer</p>
          </div>
          <div className="bg-[#e0f7fa] p-6 rounded-lg m-4 w-full sm:w-1/2 shadow">
            <p>
              "Investing in sustainable agriculture has never felt this impactful. Great platform!"
            </p>
            <p className="text-[#555] italic mt-2">- Jane Smith, Investor</p>
          </div>
        </div>
      </section>

      {/* How It Works Link */}
      <div className="mb-8">
        <Link to="/how-it-works" className="text-blue-500 underline text-lg">
          Learn How It Works
        </Link>
      </div>
    </div>
  );
};

export default Home;
