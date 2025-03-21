// SignInPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // Adjust path as needed
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

const SignInPage = () => {
  const endpoint = useSelector(state => state.endpoint.endpoint);
  const navigate = useNavigate();

  // States for email login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for handling loading indicator (optional)
  const [isLoading, setIsLoading] = useState(false);

  // Handler for Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Retrieve the Firebase ID token:
      const idToken = await user.getIdToken();

      const response = await axios.post(`${endpoint}/auth/google-signin`, {
        idToken,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      alert("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${endpoint}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col items-center justify-center p-4 space-y-8">
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div>Loading...</div>
        </div>
      )}

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <Sprout className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-emerald-800">
          Welcome to 5 Acre Organics
        </h1>
        <p className="text-emerald-600">
          Sign in to continue your sustainable farming journey
        </p>
      </motion.div>

      {/* Google Sign-In Section */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        <h2 className="text-xl font-semibold text-center text-emerald-800 mb-4">
          Sign In with Google
        </h2>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3.5 bg-red-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
        >
          Sign in with Google
        </button>
      </div>

      {/* Email/Password Login Section */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        <h2 className="text-xl font-semibold text-center text-emerald-800 mb-4">
          Sign In with Email
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-emerald-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-emerald-600">
          New to 5 Acre Organics?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-emerald-700 font-semibold hover:text-emerald-800 hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
