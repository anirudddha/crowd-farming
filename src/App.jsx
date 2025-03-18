import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './router';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

import { Provider } from 'react-redux';
import store from './redux/globalStates';

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <Toaster position="top-right" />
        <Header />
        <Routes />
        <Footer />
      </Provider>
    </Router>
  );
};

export default App;
