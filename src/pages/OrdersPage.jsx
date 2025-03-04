import React, { useState } from 'react';
import { FiPackage, FiCreditCard, FiTruck, FiCheckCircle, FiUser, FiX } from 'react-icons/fi';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sample order data matching your schema
  const orders = [
    {
      _id: "65f3a8b97e1561297e85d789",
      userId: "6713b7b97e1561297e85c253",
      items: [
        {
          itemId: "65f1d6b97e1541297e85a123",
          name: "Organic Turmeric Powder",
          image: "https://example.com/turmeric.jpg",
          size: "250gm",
          quantity: 2,
          price: 50,
          totalPrice: 100
        },
        {
          itemId: "65f1d6b97e1541297e85a456",
          name: "Cold Pressed Coconut Oil",
          image: "https://example.com/coconut-oil.jpg",
          size: "500gm",
          quantity: 1,
          price: 90,
          totalPrice: 90
        }
      ],
      totalAmount: 190,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      shippingAddress: {
        name: "Aniruddha",
        phone: "+91-9876543210",
        addressLine1: "At Pawarwadi, Post Nandgaon",
        city: "Karad",
        state: "Maharashtra",
        zipCode: "415112",
        country: "India"
      },
      orderStatus: "Processing",
      createdAt: "2024-02-21T12:00:00Z",
      updatedAt: "2024-02-21T12:10:00Z"
    }
    // Add more orders...
  ];

  // Status styling configuration
  const statusStyles = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
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
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-500" />
                      {order.shippingAddress.name}
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
                      {order.totalAmount}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden">
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
                          {selectedOrder.shippingAddress.addressLine1},<br />
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
                              <span className="font-medium">₹{item.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>₹{selectedOrder.totalAmount}</span>
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
