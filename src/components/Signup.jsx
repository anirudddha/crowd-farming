// src/pages/Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // Import the CSS file

const Signup = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const navigate = useNavigate(); // Hook to navigate between routes

  // Handle form input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      // Send signup request to the backend
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Signup successful! Please log in.'); // Alert user on success
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Signup failed:', error); // Log error for debugging
      alert('Error during signup: ' + (error.response?.data?.error || 'Unknown error')); // Display error
      console.log(formData); // Log form data for reference
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup} className="signup-form">
        {/* Username input */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {/* Signup button */}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
