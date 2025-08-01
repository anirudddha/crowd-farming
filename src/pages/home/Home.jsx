import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Assuming you use Redux for the endpoint
import { FaHandshake, FaChartLine, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';
import { motion } from 'framer-motion';
// import CountUp from 'react-countup'; // You can re-enable this if you use the metrics section

// A reusable card component for the spotlight section
const ProjectCard = ({ project }) => {
  const raisedPercentage = Math.round((project.raisedAmount / project.fundingGoal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <img 
        src={project.visuals[0]?.url || 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1920&q=80'} // Fallback image
        alt={project.campaignTitle}
        className="h-96 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex flex-col justify-end">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-md">{project.campaignTitle}</h3>
          <div className="grid grid-cols-2 gap-4 text-emerald-100">
            <div>
              <p className="text-sm">Funding Goal</p>
              <p className="font-semibold">
                ₹{new Intl.NumberFormat('en-IN').format(project.fundingGoal)}
              </p>
            </div>
            <div>
              <p className="text-sm">Annual Return</p>
              <p className="font-semibold">{project.expectedReturns.min}-{project.expectedReturns.max}%</p>
            </div>
          </div>
          <div className="pt-2">
            <div className="h-2.5 bg-white/20 rounded-full">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${raisedPercentage}%` }}
              />
            </div>
            <p className="text-right text-sm text-amber-300 mt-2">
              {raisedPercentage}% Funded
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const endpoint = useSelector(state => state.endpoint.endpoint); // Get endpoint from Redux

  const [spotlightFarms, setSpotlightFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only the top 3 farms sorted by amount raised
  const fetchSpotlightFarms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${endpoint}/campaigns`, {
        params: {
          limit: 3,
          sortBy: 'raisedAmount', // Key to sort by
          sortOrder: 'desc',     // Sort in descending order
        },
      });
      const data = Array.isArray(response.data.campaigns) ? response.data.campaigns : [];
      setSpotlightFarms(data);
    } catch (error)
    {
      console.error('Error fetching spotlight campaigns:', error);
      // You could set an error state here if needed
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchSpotlightFarms();
  }, [fetchSpotlightFarms]);


  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-green-700 to-emerald-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-2 rounded-full mb-8">
              <FaLeaf className="text-xl" />
              <span className="font-semibold">Pioneering Sustainable Agri-Finance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
              Transformative Investments in 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-green-300"> Regenerative Agriculture</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
              Connect directly with verified organic farms seeking growth capital while offering investors market-competitive returns
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/farms')}
                className="bg-amber-400 hover:bg-amber-500 text-green-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaTractor className="text-xl" />
                Explore Farms
              </button>
              <button
                onClick={() => navigate('/invest')}
                className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
              >
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-amber-300/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-green-400/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="py-12 bg-emerald-50 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 mb-6">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-75">
            {['USDA Organic', 'Fair Trade', 'Rainforest Alliance', 'B Corp', 'Global Organic'].map((logo, i) => (
              <div key={i} className="text-center text-gray-600 font-semibold text-lg">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { icon: FaHandshake, title: "Fair Partnerships", content: "Equitable profit-sharing models with built-in farmer protections", color: "text-green-600" },
              { icon: FaChartLine, title: "Smart Returns", content: "7-12% annual returns with real-time impact tracking", color: "text-amber-600" },
              { icon: FaLeaf, title: "Ecosystem Impact", content: "Verified biodiversity enhancement metrics across all projects", color: "text-emerald-600" },
            ].map((item, i) => (
              <motion.div key={i} variants={slideUp} className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <item.icon className={`text-5xl mb-6 ${item.color}`} />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DYNAMIC Featured Projects Section */}
      <section className="py-24 px-6 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Spotlight Investments</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Curated opportunities with the highest investor backing</p>
          </div>
          
          {loading ? (
            <div className="text-center">
              <p className="text-gray-500">Loading top farms...</p>
            </div>
          ) : spotlightFarms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spotlightFarms.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <p className="text-gray-600">No active investment opportunities at the moment. Please check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Investor CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Cultivate Wealth & Purpose</h2>
              <p className="text-lg text-emerald-100 mb-8">
                Join 25,000+ impact investors building sustainable wealth through regenerative agriculture
              </p>
              <button
                onClick={() => navigate('/farms')}
                className="bg-amber-400 hover:bg-amber-500 text-green-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Start Investing Today
                <FaSeedling className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;