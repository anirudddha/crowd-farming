import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Sprout, HandCoins, Leaf, BarChart, Gift, Globe, ClipboardCheck, Tractor, Users, AreaChart, Quote, Wind, Droplets, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
        >
          Cultivating Sustainable Futures
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Empower farmers, grow communities, and harvest returns. We connect you directly with sustainable agriculture projects that make a real-world impact.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/farms"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-transform hover:scale-105 transform text-lg font-semibold"
          >
            Explore Farms
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our 3-Step Collaborative Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Sprout className="w-12 h-12 text-green-600" />, title: "Discover & Vet", text: "We perform rigorous due diligence to select high-potential, sustainable farms that align with our ethical standards.", color: "bg-green-100" },
              { icon: <HandCoins className="w-12 h-12 text-green-600" />, title: "Fund & Empower", text: "You and our community of investors collectively fund farm operations, from seeding to equipment upgrades.", color: "bg-amber-100" },
              { icon: <Leaf className="w-12 h-12 text-green-600" />, title: "Grow & Share", text: "Farmers implement eco-friendly practices. As the harvest succeeds, you share in the financial returns or produce.", color: "bg-teal-100" }
            ].map((step, index) => (
              <div key={index} className={`p-8 rounded-2xl ${step.color} transition-transform hover:scale-105`}>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Our Impact By The Numbers Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Measurable Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <Tractor className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-green-700">1,200+</p>
              <p className="text-lg text-gray-600 mt-2">Acres Sustainably Farmed</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-green-700">300+</p>
              <p className="text-lg text-gray-600 mt-2">Farmers Empowered</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <AreaChart className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-green-700">8.5%</p>
              <p className="text-lg text-gray-600 mt-2">Average Annualized Return</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-green-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full"></div>
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full"></div>
            <h2 className="text-3xl font-bold mb-8 relative z-10">Why Invest With Us?</h2>
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { icon: <Gift className="w-8 h-8" />, title: "Tangible Rewards", text: "Choose your return: a share of the profits or a box of the fresh, organic produce you helped grow." },
                { icon: <Globe className="w-8 h-8" />, title: "Environmental Impact", text: "Directly contribute to carbon sequestration, improved soil health, and biodiversity. Track your impact on your dashboard." },
                { icon: <ClipboardCheck className="w-8 h-8" />, title: "Radical Transparency", text: "Receive regular, detailed updates, from planting milestones to financial reports. See exactly where your money goes." }
              ].map((benefit, index) => (
                <div key={index} className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-green-50">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Technology Behind Your Investment Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">The Agritech Platform Powering Your Investment</h2>
            <p className="text-lg text-gray-600 mb-8">
              We leverage modern technology to bring you closer to the farm than ever before, ensuring transparency and accountability at every stage.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-full"><BarChart className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h4 className="font-semibold">Real-time Data Dashboard</h4>
                  <p className="text-gray-600">Track key metrics like crop growth, and projected yield directly from your investor dashboard.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-full"><Droplets className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h4 className="font-semibold">Smart Irrigation & Resource Mgmt</h4>
                  <p className="text-gray-600">Our partner farms use IoT sensors to optimize water usage, reducing waste and environmental footprint.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="p-8 bg-gray-100 rounded-2xl">
            {/* You can place an image of a dashboard or a tech-related graphic here */}
            <img src="https://i.postimg.cc/VsGWWJYC/Screenshot-2025-07-19-193937.png" alt="Agritech Dashboard" className="rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* NEW: What Our Community Says Section */}
      {/* <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Investors Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-green-300 mb-4" />
              <p className="text-gray-600 mb-6">"It's more than an investment; it's a connection to my food and the people who grow it. The transparency is unlike any other platform."</p>
              <p className="font-semibold text-gray-900">Sarah J.</p>
              <p className="text-sm text-gray-500">Ethical Investor</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-green-300 mb-4" />
              <p className="text-gray-600 mb-6">"My portfolio needed diversification, and this was the perfect fit. The returns have been steady, and the impact is a huge bonus."</p>
              <p className="font-semibold text-gray-900">Mark T.</p>
              <p className="text-sm text-gray-500">Financial Advisor</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Quote className="w-8 h-8 text-green-300 mb-4" />
              <p className="text-gray-600 mb-6">"As a farmer, getting access to community funding was a game-changer. It allowed me to scale my organic operations faster than I ever thought possible."</p>
              <p className="font-semibold text-gray-900">David Chen</p>
              <p className="text-sm text-gray-500">Partner Farmer</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Common Questions</h2>
        <div className="space-y-4">
          {[
            { question: "What makes a farm 'sustainable'?", answer: "Our partner farms must meet strict criteria, including organic practices, water conservation techniques, promoting biodiversity, fair labor standards, and often integrating renewable energy like solar power." },
            { question: "How are financial returns calculated?", answer: "Returns are based on the net profit from the harvest sale. This is influenced by yield, market prices, and operational costs. We provide a detailed projection for each project, with typical historical returns ranging from 5-15% annually." },
            { question: "What happens if a farm underperforms?", answer: "Agriculture has inherent risks. We mitigate this through several layers: rigorous farm selection, crop insurance policies, and a platform-wide risk diversification fund to help protect investor principal in unforeseen circumstances." },
            { question: "Can I visit the farm I invested in?", answer: "Absolutely! We encourage it. We organize regular open-farm days for our investors to meet the farmers, see their investment in action, and strengthen the community connection." }
          ].map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl hover:border-green-400 transition-colors" onClick={() => toggleFaq(index)}>
              <div className="p-6 cursor-pointer flex justify-between items-center">
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <ChevronDown className={`w-5 h-5 transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {openFaqIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BarChart className="w-16 h-16 mx-auto text-white mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow More Than Just Crops?
          </h2>
          <p className="text-green-100 text-xl mb-8">
            Join 15,000+ investors nurturing a healthier planet and a more sustainable food system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-green-600 px-8 py-3 rounded-xl hover:bg-gray-100 font-medium transform hover:scale-105 transition-transform">
              Start Investing
            </Link>
            <Link to="/about" className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white/10 transform hover:scale-105 transition-transform">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;