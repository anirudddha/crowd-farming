const { Router } = require("express");
const Items = require("../models/Items"); // Assuming your model file is named 'Items.js'
const multer = require("multer");
const User = require("../models/User");
const auth = require("../middleware/userAuth");
const cloudinary = require("cloudinary").v2;

const itemRouter = new Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'duz18zmq0',
  api_key: '396247895111179',
  api_secret: 'lgi9nLxOZs3FoFv2Kh9lPfFlz6M' // It's best practice to use environment variables for secrets
});

// Use memory storage for multer to handle files as buffers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @route   GET /
 * @desc    Get all items
 * @access  Public
 */
itemRouter.get("", async (req, res) => {
  try {
    const response = await Items.find();
    res
      .status(200)
      .json({ message: "Data retrieved successfully", response: response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

// Helper function to upload a buffer to Cloudinary
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce_items" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        // Resolve with the object matching the ImageSchema
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * @route   POST /add
 * @desc    Add a new item
 * @access  Private (should be protected by admin auth)
 */
itemRouter.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    // Upload all image buffers to Cloudinary in parallel
    const uploadedImages = await Promise.all(
      req.files.map(file => uploadBufferToCloudinary(file.buffer))
    );

    // Destructure fields from the request body
    const {
      name,
      category,
      brand,
      farmName,
      isOrganic,
      deliveryTime,
      tags,
      variants, // This now contains price, weight, availability etc.
      description,
      ingredients,
      usageInfo,
      benefits,
      storageInfo,
      faq,
    } = req.body;

    // --- MODIFICATION START ---
    // The new schema requires 'variants' to be an array of objects.
    // Form-data might send this as a JSON string, so we parse it.
    // Obsolete fields like 'price', 'weights', 'isAvailable' have been removed.

    let parsedVariants;
    try {
      // It's safer to parse inside a try-catch block
      parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch (error) {
       return res.status(400).json({ message: "Invalid format for variants. It should be a JSON array string." });
    }
    
    // Helper function for safe parsing
    const safeParse = (data) => (typeof data === "string" ? JSON.parse(data) : data || []);

    // Create a new item instance based on the new ItemSchema
    const newItem = new Items({
      name,
      category,
      brand,
      farmName,
      isOrganic: isOrganic === "true", // Convert string from form-data to boolean
      deliveryTime,
      tags: safeParse(tags),
      variants: parsedVariants, // The variants array now holds size, price, weight info
      images: uploadedImages, // Array of {url, public_id} objects from Cloudinary
      description,
      ingredients: safeParse(ingredients),
      usageInfo: safeParse(usageInfo), // Now an array of strings
      benefits: safeParse(benefits),   // Now an array of strings
      storageInfo,
      faq: safeParse(faq),
      // 'rating' and 'reviewsCount' will use schema defaults (0)
      // 'reviews' will use schema default ([])
    });
    // --- MODIFICATION END ---

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (e) {
    console.error(e);
    // Provide more specific error messages if possible
    res.status(400).json({ message: "Failed to add item", error: e.message });
  }
});

/**
 * @route   GET /:id
 * @desc    Get a single item by its ID
 * @access  Public
 */
itemRouter.get('/:id', async (req, res) => {
  try {
    // --- MODIFICATION START ---
    // Use findById to get a single document directly, which is more efficient.
    const item = await Items.findById(req.params.id);

    if (!item) {
      // If no item is found with that ID, return a 404.
      return res.status(404).json({ message: 'Item not found' });
    }
    // Return the single item object, not an array.
    res.json(item);
    // --- MODIFICATION END ---
  } catch (err) {
    // Handle potential errors, like an invalid MongoDB ObjectId format
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * @route   PUT /:id/review
 * @desc    Add a review to a product
 * @access  Private (requires user login)
 */
itemRouter.put('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Get user details from the token
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { name: username, email } = user;

    // Validate input
    if (rating === undefined || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 0 and 5." });
    }

    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user has already reviewed this item
    const existingReview = item.reviews.find((review) => review.email === email);
    if (existingReview) {
      // Use 409 Conflict for a more specific status code
      return res.status(409).json({ message: "You have already submitted a review for this product." });
    }

    // Create a new review object matching the ReviewSchema
    const newReview = { username, rating, comment, email, createdAt: new Date() };
    item.reviews.push(newReview);
    
    // Update review count and average rating
    item.reviewsCount = item.reviews.length;
    item.rating = (
      item.reviews.reduce((acc, rev) => acc + rev.rating, 0) / item.reviews.length
    ).toFixed(1);

    await item.save();

    return res.status(200).json({ message: "Review added successfully", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = { itemRouter };