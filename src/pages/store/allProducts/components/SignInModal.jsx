// src/components/SignInModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const SignInModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-2xl p-6 z-10 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to continue shopping with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SignInModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SignInModal;