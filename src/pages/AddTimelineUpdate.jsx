import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddTimelineUpdate = () => {
  const { id } = useParams();
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  const navigate = useNavigate();

  // Form state for new timeline update fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // default to today's date
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for existing timeline updates
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch campaign details to retrieve timeline updates
  useEffect(() => {
    const fetchTimelineUpdates = async () => {
      try {
        const response = await axios.get(`${endpoint}/campaigns/${id}`);
        // Assume the campaign response includes a 'timeline' field
        if (response.data.timeline && response.data.timeline.length > 0) {
          setTimeline(response.data.timeline);
        } else {
          // Fallback demo timeline data if none exist
          setTimeline([
            {
              date: "2023-05-01",
              title: "Farm Preparation",
              description: "Soil testing and groundwork were completed to set the stage for planting.",
              images: [
                "https://img.freepik.com/free-vector/farm-scene-nature-with-barn_1308-32159.jpg?semt=ais_hybrid",
                "https://img.freepik.com/free-vector/farm-scene-nature-with-barn_1308-32159.jpg?semt=ais_hybrid"
              ]
            },
            {
              date: "2023-06-15",
              title: "Planting Season",
              description: "Crops were planted with careful seed selection and proper scheduling.",
              images: [
                "https://img.freepik.com/free-vector/farm-scene-nature-with-barn_1308-32159.jpg?semt=ais_hybrid"
              ]
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching timeline updates:', error);
        toast.error("Failed to load timeline updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineUpdates();
  }, [id, endpoint]);

  // Handle file selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handle form submission for new update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('date', date);
      formData.append('description', description);
      images.forEach((file) => {
        formData.append('images', file);
      });
      console.log(formData);
      // After building formData, add this snippet to log its contents:
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    console.log(formData.get('images'));
      await axios.post(`${endpoint}/campaigns/${id}/timeline-update`,formData);
      toast.success("Timeline update added successfully!");
      // Option 1: Refresh the timeline list after adding update
    //   const response = await axios.get(`${endpoint}/campaigns/${id}`);
    //   setTimeline(response.data.timeline || timeline);
      // Option 2: Navigate back (comment the following line if you prefer refresh)
      // navigate(-1);
      // Reset form fields
    //   setTitle('');
    //   setDate(new Date().toISOString().split('T')[0]);
    //   setDescription('');
    //   setImages([]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to add update");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format dates
  const formatDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-8"
      >
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">Add Timeline Update</h1>

        {/* Existing Timeline Updates */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">Existing Timeline</h2>
          {loading ? (
            <p>Loading timeline updates...</p>
          ) : (
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="border-l-2 border-emerald-200 pl-4 relative">
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium text-emerald-900">{event.title}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-sm text-emerald-700">{event.description}</p>
                  {event.images && event.images.length > 0 && (
                    <div className="flex gap-4 mt-2">
                      {event.images.map((imgUrl, imgIndex) => (
                        <img 
                          key={imgIndex}
                          src={imgUrl}
                          alt={`${event.title} ${imgIndex + 1}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form to Add New Timeline Update */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Images (optional)</label>
            <input 
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Add Update'}
          </button>
        </form>

        {/* Navigation Button */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTimelineUpdate;
