// src/pages/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import the CSS file

const Login = () => {
  // State to manage email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate routes

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store token on success
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error); // Log error for debugging
      alert('Invalid credentials: ' + (error.response?.data?.error || 'Unknown error')); // Alert on failure
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          style={{ width: "auto" }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={{ width: "auto" }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
