import axios from 'axios';
import { Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FiPackage, FiCreditCard, FiTruck, FiCheckCircle, FiUser, FiX } from 'react-icons/fi';
const endPoint = "http://localhost:5000/"

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);


  const fetchSelectedItem = async (order) => {
    let items = order.items;
    // console.log(items);

    // Fetch item details asynchronously and update the state
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const response = await axios.get(`${endPoint}api/items/${item.itemId}`);
          // console.log(response);

          return {
            ...item,
            image: response.data[0].images[0], // Adding image to the item
          };
        } catch (error) {
          console.error("Error fetching item data:", error);
          return { ...item, image: "" }; // Handle errors gracefully
        }
      })
    );

    // Update state with items that include images
    setSelectedOrder({ ...order, items: updatedItems });
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Assuming the API response structure is:
        // { data: { data: { orders: [ ... ] } } }
        // Adjust the following line if your structure differs.
        setOrders(response.data.data.orders);
        console.log(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  // Status styling configuration
  const statusStyles = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Pending: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farm Produce Orders</h1>
          <p className="mt-2 text-gray-600">Managing orders for organic products</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ordered at</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Products</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    fetchSelectedItem(order);
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* <FiUser className="mr-2 text-gray-500" /> */}
                      <Calendar className='mr-2 text-gray-500 p-[3.5px]' />
                      {order.updatedAt.slice(0, 10) || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiPackage className="mr-2 text-gray-500" />
                      {order.items.length} items
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusStyles[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">₹</span>
                      {order.totalPrice || order.totalAmount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]" >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FiPackage className="mr-2 text-green-600" />
                    Order #{selectedOrder._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer & Payment Info */}
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <FiUser className="mr-2 text-green-600" />
                      Customer Details
                    </h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-600">Name</dt>
                        <dd>{selectedOrder.shippingAddress.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Contact</dt>
                        <dd>{selectedOrder.shippingAddress.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-600">Address</dt>
                        <dd className="text-sm">
                          {selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.addressLine1},<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                          {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <FiCreditCard className="mr-2 text-blue-600" />
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded ${selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items & Timeline */}
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <FiTruck className="mr-2 text-orange-500" />
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.size} • {item.quantity} units
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm">₹{item.price}/unit</span>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>₹{selectedOrder.totalPrice || selectedOrder.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <FiCheckCircle className="mr-2 text-purple-600" />
                      Order Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="text-green-600 w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiPackage className="text-blue-600 w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-gray-600">
                            Estimated completion: {new Date(selectedOrder.updatedAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Order Status:{' '}
                    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[selectedOrder.orderStatus]}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
