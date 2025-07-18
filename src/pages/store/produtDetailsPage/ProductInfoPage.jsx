import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { increase } from '../../../redux/globalStates';
import Loader from '../../../components/Loader';

// Import the new, redesigned components
import ImageGallery from './components/ImageGallery';
import ProductHeader from './components/ProductHeader';
import ProductActions from './components/ProductActions';
import ProductInfoTabs from './components/ProductInfoTabs';

const ProductPage = () => {
  const { id } = useParams();
  const endpoint = useSelector(state => state.endpoint.endpoint);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Callback to fetch product data, memoized for efficiency
  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`${endpoint}/items/${id}`);
      const fetchedProduct = response.data;
      setProduct(fetchedProduct);

      // Set the initial variant
      if (fetchedProduct?.variants?.length > 0) {
        const availableVariant = fetchedProduct.variants.find(v => v.available);
        setSelectedVariant(availableVariant || fetchedProduct.variants[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Could not load product details.');
    }
  }, [id, endpoint]);

  // Fetch product data on component mount
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Callback for adding item to cart
  const handleAddToCart = useCallback(async () => {
    if (!token) {
      toast.error('Please sign in to add items to your cart.');
      return;
    }
    if (!selectedVariant) {
        toast.error('Please select a product variant.');
        return;
    }

    const toastId = toast.loading('Adding to cart...');
    try {
      await axios.post(`${endpoint}/cart`, {
        itemId: id,
        size: selectedVariant.size,
        quantity: 1,
        weight: selectedVariant.weight
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      dispatch(increase());
      toast.success(
        <span className="flex items-center gap-2">
          Added to cart! 
          <Link to="/shop/cart" className="font-bold underline text-emerald-600">View Cart</Link>
        </span>,
        { id: toastId, duration: 4000 }
      );
    } catch (e) {
      toast.error('Failed to add item to cart.', { id: toastId });
    }
  }, [id, selectedVariant, token, endpoint, dispatch]);

  // Callback for submitting a new review
  const handleReviewSubmit = useCallback(async (reviewData) => {
    if (reviewData.rating === 0 || reviewData.comment.trim() === '') {
      toast.error('Please provide a rating and a comment.');
      return false; // Indicate failure
    }
    if (!token) {
      toast.error('You must be signed in to submit a review.');
      return false; // Indicate failure
    }
    
    const toastId = toast.loading('Submitting review...');
    try {
      await axios.put(`${endpoint}/items/${id}/review`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProduct(); // Re-fetch product to show the new review
      toast.success('Review submitted successfully!', { id: toastId });
      return true; // Indicate success
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review.';
      toast.error(errorMsg, { id: toastId });
      return false; // Indicate failure
    }
  }, [id, token, endpoint, fetchProduct]);

  // Display a loader while the product data is being fetched
  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Toaster position="bottom-right" toastOptions={{
        className: 'text-sm font-medium',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }}/>
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-16 gap-8 lg:gap-12 mb-16 lg:mb-0">
          
          {/* Image Gallery Column (takes 3/5 width on desktop) */}
          <div className="lg:col-span-9">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info & Actions Column (takes 2/5 width on desktop) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 flex flex-col space-y-8">
              <ProductHeader
                name={product.name}
                category={product.category}
                farmName={product.farmName}
                rating={product.rating}
                reviewsCount={product.reviews?.length || 0}
                isOrganic={product.isOrganic}
              />
              <ProductActions
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </section>

        {/* --- DETAILS & REVIEWS SECTION --- */}
        <section id="reviews">
          <ProductInfoTabs product={product} onReviewSubmit={handleReviewSubmit} />
        </section>
      </main>
    </div>
  );
};

export default ProductPage;