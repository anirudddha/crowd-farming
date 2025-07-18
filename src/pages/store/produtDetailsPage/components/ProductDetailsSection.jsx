// src/pages/ProductPage/components/ProductDetailsSection.js
import React from 'react';
import { FaLeaf } from 'react-icons/fa';
import { FiClock, FiPackage, FiHeart, FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const InfoCard = ({ icon, title, children, color }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }}
    className="bg-white p-6 rounded-2xl shadow-sm border"
  >
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-${color}-100`}>
      {React.cloneElement(icon, { className: `w-6 h-6 text-${color}-600` })}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <div className="prose prose-sm text-gray-600 max-w-none">{children}</div>
  </motion.div>
);

const AccordionItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
        <span className="font-semibold text-gray-800">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiHelpCircle className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-4 text-gray-600">{a}</div>
      </motion.div>
    </div>
  );
};

const ProductDetailsSection = ({ product }) => (
  <div className="space-y-12">
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Product</h2>
      <div className="prose lg:prose-lg max-w-none text-gray-700 leading-relaxed">
        {product.description}
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard icon={<FiClock/>} title="Usage Guide" color="blue">
        <ul className="list-disc pl-5 space-y-1">
          {product.usageInfo.map((info, i) => <li key={i}>{info}</li>)}
        </ul>
      </InfoCard>
      <InfoCard icon={<FiPackage/>} title="Storage Tips" color="amber">
        <p>{product.storageInfo}</p>
      </InfoCard>
      <InfoCard icon={<FaLeaf/>} title="Ingredients" color="emerald">
        <p>{product.ingredients.join(', ')}.</p>
      </InfoCard>
      <InfoCard icon={<FiHeart/>} title="Health Benefits" color="red">
        <ul className="list-disc pl-5 space-y-1">
          {product.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
        </ul>
      </InfoCard>
    </div>

    {product.faq?.length > 0 && (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="bg-white p-4 rounded-2xl border">
          {product.faq.map((item, i) => <AccordionItem key={i} q={item.question} a={item.answer} />)}
        </div>
      </div>
    )}
  </div>
);

export default ProductDetailsSection;