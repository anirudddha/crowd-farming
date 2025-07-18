import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Sprout, HandCoins, Leaf, BarChart, Gift, Globe, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Cultivating Sustainable Futures
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Empower farmers, grow communities, and harvest returns through ethical agricultural investments
        </p>
        <Link 
          to="/farms" 
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors text-lg"
        >
          Explore Farms
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Collaborative Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Sprout className="w-12 h-12 text-green-600" />,
                title: "Farm Selection",
                text: "We vet sustainable farms needing support",
                color: "bg-green-100"
              },
              { 
                icon: <HandCoins className="w-12 h-12 text-green-600" />,
                title: "Community Funding",
                text: "Investors collectively fund operations",
                color: "bg-amber-100"
              },
              { 
                icon: <Leaf className="w-12 h-12 text-green-600" />,
                title: "Sustainable Growth",
                text: "Farmers implement eco-friendly practices",
                color: "bg-teal-100"
              }
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

      {/* Investor Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-green-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-8">Why Invest With Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Gift className="w-8 h-8" />,
                  title: "Tangible Rewards",
                  text: "Receive farm produce or profit shares"
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "Global Impact",
                  text: "Track your environmental contribution"
                },
                {
                  icon: <ClipboardCheck className="w-8 h-8" />,
                  title: "Full Transparency",
                  text: "Regular updates on farm progress"
                }
              ].map((benefit, index) => (
                <div key={index} className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-green-50">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Common Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "What makes your farms sustainable?",
              answer: "All partners implement organic practices, water conservation, and renewable energy solutions."
            },
            {
              question: "How are returns calculated?",
              answer: "Returns vary by project but typically range from 5-15% based on crop success and market prices."
            },
            {
              question: "What happens if a farm underperforms?",
              answer: "Our risk mitigation fund and insurance policies help protect investor principal."
            }
          ].map((faq, index) => (
            <div 
              key={index}
              className="border rounded-xl hover:border-green-600 transition-colors"
              onClick={() => toggleFaq(index)}
            >
              <div className="p-6 cursor-pointer flex justify-between items-center">
                <h3 className="font-medium">{faq.question}</h3>
                <ChevronDown className={`w-5 h-5 transform transition-transform ${
                  openFaqIndex === index ? 'rotate-180' : ''
                }`} />
              </div>
              {openFaqIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 pb-6 text-gray-600"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BarChart className="w-16 h-16 mx-auto text-white mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow More Than Crops?
          </h2>
          <p className="text-green-100 text-xl mb-8">
            Join 15,000+ investors nurturing sustainable agriculture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-green-600 px-8 py-3 rounded-xl hover:bg-gray-100 font-medium"
            >
              Start Investing
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;