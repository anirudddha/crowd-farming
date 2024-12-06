import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/headers.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state for login status
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add state for hamburger menu

  useEffect(() => {
    // Check if the user is logged in (you can use localStorage or context)
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, 3000); // Check every 3 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu open/close state
  };

  return (
    <header>
      <h1>5 Acre Farm</h1>
      <div className="menus">
        <div className={`navmemus ${isMenuOpen ? 'open' : ''}`}>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/how-it-works">How it Works</Link>
            <Link to="/farms">Farm Listings</Link>
            <Link to="/create">Create Campaign</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
        <div className="auth-links">
          {!isLoggedIn ? (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="hamburger" style={{alignItems:"center",margin:"20px"}} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <hr />
        <nav>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/how-it-works">How it Works</Link>
          <Link to="/farms" onClick={toggleMenu} >Farm Listings</Link>
          <Link to="/create" onClick={toggleMenu} >Create Campaign</Link>
          <Link to="/dashboard" onClick={toggleMenu} >Dashboard</Link>
          <Link to="/profile" onClick={toggleMenu} >Profile</Link>
        </nav>
        <div className="auth-links-1">
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={toggleMenu}>Sign In</Link>
              <Link to="/signup" onClick={toggleMenu}>Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
