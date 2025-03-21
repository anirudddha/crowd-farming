import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import FarmListings from '../pages/FarmListings';
import CampaignDetails from '../pages/CampaignDetails';
import CreateCampaign from '../pages/CreateCampaign';
import Profile from '../pages/Profile';
import InvestorDashboard from '../components/InvestorDashboard';
import HowItWorks from '../pages/HowItWorks';
import StorePage from '../pages/StorePage';

import Login from '../components/Login'; // Import Login
import Signup from '../components/Signup'; // Import Signup
import ProtectedRoute from '../components/Protected'; // To protect routes
import CartPage from '../pages/CartPage';
import ProductInfoPage from '../pages/ProductInfoPage';
import OrdersPage from '../pages/OrdersPage';
import CheckOutOrder from '../pages/CheckOutOrder';
import GoogleSigninPage from '../pages/GoogleSigninPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/google-login" element={<GoogleSigninPage />} />
      <Route path="/farms" element={<FarmListings />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path='/shop' element={<StorePage />} />
      <Route path='/shop/cart' element={<CartPage />} />

      {/* for testing purpose */}
      <Route path="/shop/itemInfo/:id" element={<ProductInfoPage />} />
      <Route path="/shop/orders" element={<OrdersPage />} />
      <Route path="/shop/cart/checkOut" element={<CheckOutOrder />} />
      
      {/* Protected Routes */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <InvestorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
