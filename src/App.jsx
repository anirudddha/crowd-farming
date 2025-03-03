import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './router';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Header />
      <Routes />
      <Footer />
    </Router>
  );
};

export default App;
