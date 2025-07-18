// src/pages/ProductPage/components/ProductInfoTabs.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDetailsSection from './ProductDetailsSection';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const TABS = {
    DETAILS: 'Product Details',
    REVIEWS: 'Reviews',
};

const ProductInfoTabs = ({ product, onReviewSubmit }) => {
    const [activeTab, setActiveTab] = useState(TABS.DETAILS);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleReviewSubmit = async (reviewData) => {
        const success = await onReviewSubmit(reviewData);
        if (success) {
            setShowReviewForm(false);
            setActiveTab(TABS.REVIEWS);
        }
    };

    return (
        <div className="w-full mt-16 lg:mt-0 py-15">
            <div className="border-b border-gray-200 mb-8">
                <div className="flex space-x-8">
                    {Object.values(TABS).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="relative py-4 px-1 text-base font-semibold transition-colors outline-none"
                        >
                            <span className={activeTab === tab ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}>
                                {tab === TABS.REVIEWS ? `${tab} (${product.reviews?.length || 0})` : tab}
                            </span>
                            {activeTab === tab && (
                                <motion.div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-600" layoutId="tab-underline" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === TABS.DETAILS && <ProductDetailsSection product={product} />}
                    {activeTab === TABS.REVIEWS && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                                </button>
                            </div>
                            {showReviewForm ? (
                                <ReviewForm
                                    onSubmit={handleReviewSubmit}
                                    onCancel={() => setShowReviewForm(false)}
                                />
                            ) : (
                                <ReviewList reviews={product.reviews} />
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ProductInfoTabs;