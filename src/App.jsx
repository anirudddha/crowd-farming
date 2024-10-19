import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './router';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes />
      <Footer />
    </Router>
  );
};

export default App;
