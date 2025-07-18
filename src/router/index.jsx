import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import FarmListings from '../pages/campaign/FarmListings';
import CampaignDetails from '../pages/campaign/CampaignDetails';
import CreateCampaign from '../pages/campaign/CreateCampaign';
import Profile from '../pages/Profile';
import InvestorDashboard from '../components/InvestorDashboard';
import HowItWorks from '../pages/howItWorks/HowItWorks';
import StorePage from '../pages/store/allProducts/StorePage';

import Login from '../pages/auth/Login'; // Import Login
import Signup from '../pages/auth/Signup';
import ProtectedRoute from '../components/Protected'; // To protect routes
import CartPage from '../pages/store/CartPage';
import ProductInfoPage from '../pages/store/produtDetailsPage/ProductInfoPage';
import OrdersPage from '../pages/store/orderPage/OrdersPage';
import CheckOutOrder from '../pages/store/checkoutPage/CheckOutOrder';
import GoogleSigninPage from '../pages/auth/GoogleSigninPage'
import CheckoutFarmInvestment from '../pages/campaign/CheckoutFarmInvestment';
import InvestedFarmDetailsExtended from '../pages/campaign/InvestedFarmDetails';
import AddTimelineUpdate from '../pages/campaign/AddTimelineUpdate';

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

      {/* for testing purpose */}
      <Route path="/shop/itemInfo/:id" element={<ProductInfoPage />} />
      <Route path="/shop/orders" element={<OrdersPage />} />
      <Route path="/shop/cart/checkOut" element={<CheckOutOrder />} />

      <Route path="/campaign/:id/invest" element={<CheckoutFarmInvestment />} />
      <Route path="/invested-farm-details/:campaignId/:investmentId" element={<InvestedFarmDetailsExtended />} />

      <Route path="/add-timeline-update/:id" element={<AddTimelineUpdate />} />
      


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
        path='/shop/cart'
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>}
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
