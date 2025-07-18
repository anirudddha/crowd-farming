// src/pages/CheckoutPage/components/OrderSummary.js

import React from 'react';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Now accepts finalTotal directly
const OrderSummary = ({ cartItems, finalTotal, isPlacingOrder, onConfirmOrder }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 5.99;
    const taxes = parseFloat((subtotal * 0.075).toFixed(2));

    return (
        // This component is a sticky sidebar on desktop
        <div className="bg-white rounded-xl shadow-sm p-6 sticky md:top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-900">₹{taxes.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-emerald-600">
                        ₹{finalTotal.toFixed(2)}
                    </span>
                </div>
            </div>

            <button
                onClick={onConfirmOrder}
                disabled={isPlacingOrder}
                className="hidden lg:flex w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors items-center justify-center space-x-2 disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
                {isPlacingOrder ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                ) : (
                    <ShieldCheckIcon className="h-5 w-5" />
                )}
                <span>{isPlacingOrder ? 'Processing...' : 'Place Order'}</span>
            </button>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 inline-flex items-center space-x-1">
                    <LockClosedIcon className="h-4 w-4" />
                    <span>Secure SSL Encryption</span>
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;