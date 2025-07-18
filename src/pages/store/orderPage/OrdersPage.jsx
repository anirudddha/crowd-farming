// src/pages/OrdersPage/OrdersPage.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import OrdersList from './components/OrdersList';
import OrderDetailModal from './components/OrderDetailModal';
import NoOrdersPlaceholder from './components/NoOrdersPlaceholder';

const OrdersPage = () => {
  const endpoint = useSelector(state => state.endpoint.endpoint);
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${endpoint}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sort orders by most recent first
        const sortedOrders = response.data.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [token, endpoint]);

  const handleOrderSelect = useCallback(async (order) => {
    // Immediately set the selected order to open the modal
    setSelectedOrder(order);
    setIsLoadingDetails(true);

    // Fetch item details with images in the background
    try {
      const updatedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            const response = await axios.get(`${endpoint}/items/${item.itemId}`);
            return { ...item, image: response.data.images[0] };
          } catch (error) {
            console.error(`Error fetching item ${item.itemId}:`, error);
            return { ...item, image: null }; // Handle errors gracefully
          }
        })
      );
      // Update the selected order with the new item details
      setSelectedOrder({ ...order, items: updatedItems });
    } catch (error) {
      console.error("Error fetching item details for order:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [endpoint]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            View your order history and track the status of current orders.
          </p>
        </div>

        {/* Main Content */}
        {orders.length > 0 ? (
          <OrdersList orders={orders} onOrderSelect={handleOrderSelect} />
        ) : (
          <NoOrdersPlaceholder />
        )}

        {/* Modal */}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          isLoading={isLoadingDetails}
        />
      </div>
    </div>
  );
};

export default OrdersPage;