import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Crowdfarming Platform</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/farms">Farm Listings</Link>
        <Link to="/create">Create Campaign</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;
