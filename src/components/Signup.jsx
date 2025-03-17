import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Error during signup: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Sprout className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              Join 5 Acre Organics
            </h1>
            <p className="text-emerald-600">
              Create your account to start your sustainable farming journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-emerald-400"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-emerald-400"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-emerald-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-emerald-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-700 font-semibold hover:text-emerald-800 hover:underline"
            >
              Log in here
            </button>
          </p>
        </div>

        {/* Form Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-emerald-600">
            By creating an account, you agree to our{' '}
            <span className="text-emerald-700 hover:underline cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-emerald-700 hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;