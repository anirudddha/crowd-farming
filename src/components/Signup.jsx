// src/pages/Signup.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '' }); // Changed name to username
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData); // formData should have username, email, and password
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Error during signup: ' + (error.response?.data?.error || 'Unknown error'));
      console.log(formData);
    }
  };
  

  return (
    <form onSubmit={handleSignup}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required /> {/* Changed name to username */}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
