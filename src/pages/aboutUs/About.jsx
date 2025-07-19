import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Corrected lucide-react import
import { ArrowRight, Target, Globe, Search, HandCoins, LineChart, Gift, Layers, FlaskConical, Users, Shield, Tractor, Coins, AreaChart, GraduationCap } from 'lucide-react';

// Placeholder data for the team section
const teamMembers = [
  {
    name: "Aniruddha Pawar",
    title: "Founder & CEO",
    bio: "A web-developer turned agri-tech entrepreneur with a BTech in Electronics Engineering and a passion for sustainable food systems.",
    // Corrected placeholder URL
    imageUrl: "https://placehold.co/150x150/22c55e/ffffff?text=AP"
  },
  {
    name: "Dr. Meera Sharma",
    title: "Head of Agronomy",
    bio: "PhD in Soil Science; 10+ years guiding farmers on organic certification and regenerative techniques.",
    imageUrl: "https://placehold.co/150x150/16a34a/ffffff?text=MS"
  },
  {
    name: "Rahul Patel",
    title: "CTO",
    bio: "Built scalable MERN-stack platforms; architect of GenHarvest’s real-time farm-tracking dashboard.",
    imageUrl: "https://placehold.co/150x150/0d9488/ffffff?text=RP"
  },
  {
    name: "Priya Nair",
    title: "Community & Partnerships Lead",
    bio: "Cultivates relationships with cooperatives, NGOs, and certification bodies to expand our farmer network.",
    imageUrl: "https://placehold.co/150x150/059669/ffffff?text=PN"
  }
];

const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-white pt-24 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Empowering Organic Farmers. Enriching Communities.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600"
          >
            GenHarvest connects conscious investors with passionate organic farmers, creating sustainable value from seed to plate.
          </motion.p>
        </div>
      </section>

      {/* 2 & 3. Our Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="p-8 border border-gray-200 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              <Target className="w-10 h-10 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <blockquote className="text-lg text-gray-700 italic border-l-4 border-green-500 pl-4">
              To democratize organic agriculture by providing farmers with fair financing, guidance, and market access—and giving investors a transparent, impact-driven opportunity to grow both crops and community.
            </blockquote>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <Globe className="w-10 h-10 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-lg text-gray-600">
              We envision a world where every farm is regenerative, every farmer thrives, and every consumer enjoys truly wholesome, traceable produce. Through technology and trust, GenHarvest will be the catalyst for a global organic farming movement.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Our Story */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The GenHarvest Story</h2>
          <div className="relative border-l-2 border-green-200 ml-6 pl-10 space-y-12">
            <div className="absolute -left-1.5 top-1 w-3 h-3 bg-green-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Founded as “5 Acre” in 2024</h3>
              <p className="text-gray-600 mt-2">GenHarvest began with a simple idea: organic farmers often lack the capital and networks to reach premium markets—while conscious investors seek authentic, high-quality produce.</p>
            </div>
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Pilot Projects & Proven Impact</h3>
              <p className="text-gray-600 mt-2">After months of pilot projects in Maharashtra, we saw how small investments translated into healthier soils, empowered families, and premium-grade grains.</p>
            </div>
             <div className="absolute -left-1.5 bottom-1 w-3 h-3 bg-green-600 rounded-full"></div>
            <div>
              <h3 className="text-xl font-semibold">Rebranded to GenHarvest in 2025</h3>
              <p className="text-gray-600 mt-2">We rebranded to GenHarvest to reflect our broader mission: generating harvests that benefit people, planet, and profit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How GenHarvest Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How Your Investment Creates Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {/* --- FIX IS HERE --- */}
            {[
              { Icon: Search, title: "1. Discover Farms", text: "Browse curated profiles of certified organic farms with soil reports, growth plans, and farmer bios." },
              { Icon: HandCoins, title: "2. Invest in Growth", text: "Your capital funds seeds, bio-fertilizers, and crucial training." },
              { Icon: LineChart, title: "3. Track & Engage", text: "Watch real-time updates—from drone footage to harvest forecasts—on your dashboard." },
              { Icon: Gift, title: "4. Reap Rewards", text: "Receive your share of grains at cost plus margin, or opt to reinvest in the next cycle." }
            ].map(({ Icon, title, text }, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                   <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. What Sets Us Apart */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The GenHarvest Difference</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* --- FIX IS HERE --- */}
            {[
              { Icon: Layers, title: "100% Transparency", text: "Detailed farm-level data, GPS-tagged fields, and monthly video updates." },
              { Icon: FlaskConical, title: "Expert Guidance", text: "Partnerships with agronomists ensure best practices and organic certification." },
              { Icon: Users, title: "Community Focus", text: "A portion of fees funds farmer training and local school gardens." },
              { Icon: Shield, title: "Tech-Enabled Trust", text: "Blockchain for produce provenance and secure smart-contracts for clear terms." }
            ].map(({ Icon, title, text }, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 7. Impact To Date */}
      {/* <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact To Date</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <Tractor className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700">50+</p>
              <p className="text-md text-gray-600">Farms Financed</p>
            </div>
            <div className="p-4">
              <Coins className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700">₹75 Lakh+</p>
              <p className="text-md text-gray-600">Invested by Community</p>
            </div>
            <div className="p-4">
              <AreaChart className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700">120 Acres</p>
              <p className="text-md text-gray-600">Transitioned to Organic</p>
            </div>
            <div className="p-4">
              <GraduationCap className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-700">2,000</p>
              <p className="text-md text-gray-600">Farmers Trained</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 8. Meet the Team */}
      {/* <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                <img
                  src={member.imageUrl}
                  alt={`Headshot of ${member.name}, ${member.title}`}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-green-200"
                />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.title}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 9. Join the Movement (CTA) */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow impact?
          </h2>
          <p className="text-green-100 text-xl mb-8">
            Invest in your first GenHarvest project today and cultivate a healthier future—for yourself, for farmers, and for the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/farms" className="bg-white text-green-600 px-8 py-3 rounded-xl hover:bg-gray-100 font-semibold text-lg transform transition-transform hover:scale-105">
              Browse Farms
            </Link>
            <Link to="/signup" className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white/10 font-semibold text-lg transform transition-transform hover:scale-105">
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;