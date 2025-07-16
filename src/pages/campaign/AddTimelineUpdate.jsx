import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt,
  FaImage,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaListAlt,
  FaTrashAlt,
} from 'react-icons/fa';

// Import your API service functions
// Adjust the path to your service file as needed
// import * as campaignService from '../services/campaignService';
import * as campaignService from '../../api/campaignApi'

const AddTimelineUpdate = () => {
  const { id } = useParams(); // This is the Campaign ID
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // Holds File objects for upload
  const [imagePreviews, setImagePreviews] = useState([]); // Holds data URLs for UI preview

  // UI/Data state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Existing Timeline ---
  const fetchTimelineUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await campaignService.getTimelineForCampaign(id);
      setTimeline(data || []);
    } catch (error) {
      console.error('Error fetching timeline updates:', error);
      toast.error('Failed to load timeline updates.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTimelineUpdates();
  }, [fetchTimelineUpdates]);

  // --- Delete a timeline update ---
  const handleDelete = useCallback(async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
        return;
    }
    const deleteToast = toast.loading('Deleting update...');
    try {
      await campaignService.deleteTimelineUpdate(id, updateId);
      toast.success('Update deleted successfully!', { id: deleteToast });
      fetchTimelineUpdates(); // Refresh the list from the server
    } catch (error) {
       console.error('Error deleting timeline update:', error);
       const errorMsg = error.response?.data?.msg || 'Failed to delete update.';
       toast.error(errorMsg, { id: deleteToast });
    }
  }, [id, fetchTimelineUpdates]);

  // --- Image Handling ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImageCount = images.length;
    const allowedNewImages = 5 - currentImageCount;

    if (files.length > allowedNewImages) {
        toast.error(`You can upload a maximum of 5 images. Please select ${allowedNewImages} or fewer.`);
        files.splice(allowedNewImages);
    }

    setImages((prevImages) => [...prevImages, ...files]);

    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file) }));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    e.target.value = null; // Allows selecting the same file again if removed
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove].url); // Free memory
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date) {
      toast.error('Title, Date, and Description are required.');
      return;
    }
    setIsSubmitting(true);
    const submissionToast = toast.loading('Adding timeline update...');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('date', date);
      formData.append('description', description);
      images.forEach((file) => formData.append('images', file));

      await campaignService.addTimelineUpdate(id, formData);

      toast.success('Timeline update added successfully!', { id: submissionToast });

      // Reset form and refresh timeline
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setImages([]);
      setImagePreviews([]);
      fetchTimelineUpdates();

    } catch (error) {
      console.error('Error adding timeline update:', error);
      const errorMsg = error.response?.data?.msg || 'Failed to add update. Please try again.';
      toast.error(errorMsg, { id: submissionToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper & Animation Variants ---
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Invalid Date';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Campaign
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center">
              <FaListAlt className="mr-3" />
              Manage Timeline Updates
            </h1>
            <p className="text-emerald-100 mt-1">View existing updates and add new milestones.</p>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.section initial="hidden" animate="visible" variants={containerVariants} className="lg:order-last">
              <h2 className="text-2xl font-semibold text-emerald-800 mb-5 flex items-center">
                <FaPlus className="mr-2 text-emerald-500" /> Add New Update
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants}>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Update Title</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow" placeholder="e.g., Planting Completed" required/>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Update</label>
                  <div className="relative">
                    <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow appearance-none pr-10" required/>
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow" rows="4" placeholder="Describe the progress or event..." required/>
                </motion.div>
                 <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images (Optional, max 5)</label>
                  <div className="flex items-center gap-4">
                     <label htmlFor="images" className={`inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg shadow-sm hover:bg-emerald-200 transition-colors cursor-pointer ${imagePreviews.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <FaImage className="mr-2" />
                        Choose Images
                    </label>
                     <input id="images" type="file" multiple onChange={handleImageChange} className="hidden" accept="image/png, image/jpeg, image/gif" disabled={imagePreviews.length >= 5}/>
                    <span className="text-sm text-gray-500">{imagePreviews.length} / 5 selected</span>
                  </div>
                    <AnimatePresence>
                       {imagePreviews.length > 0 && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, index) => (
                                <motion.div key={preview.url} className="relative aspect-square group" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} layout>
                                <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                                    <FaTimes size={12} />
                                </button>
                                </motion.div>
                            ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-6 inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? (<><FaSpinner className="animate-spin mr-2" /> Submitting...</>) : (<><FaCheckCircle className="mr-2" /> Add Update</>)}
                  </button>
                </motion.div>
              </form>
            </motion.section>

            <section>
              <h2 className="text-2xl font-semibold text-emerald-800 mb-5 flex items-center">
                <FaCalendarAlt className="mr-2 text-emerald-500" /> Existing Timeline
              </h2>
              {loading ? (
                <div className="flex justify-center items-center h-40"><FaSpinner className="animate-spin text-emerald-500 text-3xl" /></div>
              ) : timeline.length === 0 ? (
                <div className="text-center py-10 px-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FaExclamationCircle className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">No timeline updates yet.</p>
                  <p className="text-sm text-gray-500">Add the first update using the form!</p>
                </div>
              ) : (
                <motion.div className="space-y-6 relative" variants={containerVariants} initial="hidden" animate="visible">
                  {timeline.map((event, index) => (
                    <motion.div key={event._id} variants={itemVariants} className="relative pl-10">
                      <div className={`absolute left-0 top-1 w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-md ${index === 0 ? 'bg-emerald-500' : 'bg-emerald-300'}`}>
                        <FaCalendarAlt className={`text-xs ${index === 0 ? 'text-white' : 'text-emerald-700'}`} />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-emerald-900">{event.title}</h3>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(event.date)}</span>
                            <button onClick={() => handleDelete(event._id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete this update"><FaTrashAlt size={14} /></button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{event.description}</p>
                        {event.images && event.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {event.images.map((image, imgIndex) => (
                              <a key={imgIndex} href={image.url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded overflow-hidden shadow-sm transition-transform transform hover:scale-105">
                                <img src={image.url} alt={`${event.title} ${imgIndex + 1}`} className="w-full h-full object-cover" loading="lazy"/>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTimelineUpdate;