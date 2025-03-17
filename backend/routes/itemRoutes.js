const { Router } = require("express");
const Items = require("../models/Items");
const multer = require("multer");
const User = require("../models/User");
const auth = require("../middleware/userAuth");
const cloudinary = require("cloudinary").v2;
const itemRouter = new Router();


// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'duz18zmq0', 
  api_key: '396247895111179', 
  api_secret: 'lgi9nLxOZs3FoFv2Kh9lPfFlz6M' // replace with your actual API secret
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

itemRouter.get("", async (req, res) => {
  try {
    const response = await Items.find();
    // console.log(response);
    // console.log(typeof response);
    res
      .status(200)
      .json({ message: "Data retrieved successfully", response: response });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Failed to retrieve data" });
  }
});


// Helper function to upload a buffer to Cloudinary using a stream
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce_items" },
      (error, result) => {
        if (error) return reject(error);
        // Resolve with an object containing both url and public_id
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};


itemRouter.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is needed" });
    }

    // Upload all image buffers to Cloudinary
    const uploadedImageUrls = await Promise.all(
      req.files.map(file => uploadBufferToCloudinary(file.buffer))
    );

    // Destructure fields from the request body
    const {
      name,
      category,
      brand,
      price,
      originalPrice,
      farmName,
      weights,
      isOrganic,
      rating,
      reviews,
      deliveryTime,
      tags,
      variants,
      description,
      ingredients,
      usageInfo,
      benefits,
      storageInfo,
      faq,
    } = req.body;

    // Parse fields that might be sent as JSON strings
    let parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
    let parsedWeights = typeof weights === "string" ? JSON.parse(weights) : weights;
    let parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    let parsedReviews = typeof reviews === "string" ? JSON.parse(reviews) : reviews;
    let parsedIngredients = typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    let parsedUsageInfo = typeof usageInfo === "string" ? JSON.parse(usageInfo) : usageInfo;
    let parsedBenefits = typeof benefits === "string" ? JSON.parse(benefits) : benefits;
    let parsedFaq = typeof faq === "string" ? JSON.parse(faq) : faq;

    // Create a new item using provided fields and the Cloudinary image URLs
    const newItem = new Items({
      name,
      category,
      brand,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      farmName,
      weights: parsedWeights,
      isOrganic: isOrganic === "true", // converting string to boolean
      rating: Number(rating),
      reviews: parsedReviews,
      deliveryTime,
      tags: parsedTags,
      variants: parsedVariants,
      images: uploadedImageUrls, // Save Cloudinary URLs
      description,
      ingredients: parsedIngredients,
      usageInfo: parsedUsageInfo,
      benefits: parsedBenefits,
      storageInfo,
      faq: parsedFaq,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to add item", error: e.message });
  }
});




itemRouter.get('/:id', async (req, res) => {
  const productId = req.params.id;
  // console.log(productId);
  // const product = Items.find(p => p.id === productId);

  try {
    const items = await Items.find({ _id: productId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }



  // res.json(product);
});


// Route to add a review to a product
itemRouter.put('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Get user details from the token
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const username = user.name;
    const email = user.email;

    // Validate required fields
    if (!username || rating === undefined || !comment || !email) {
      return res.status(400).json({ message: "All fields (username, rating, comment, email) are required." });
    }

    if (typeof rating !== "number" || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 0 and 5." });
    }

    // Find the item
    const item = await Items.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user has already submitted a review for this product
    const existingReview = item.reviews.find((review) => review.email === email);
    if (existingReview) {
      return res.status(202).json({ message: "You have already submitted a review for this product." });
    }

    // Create and add the new review
    const newReview = { username, rating, comment, email, createdAt: new Date() };
    item.reviews.push(newReview);
    item.reviewsCount = item.reviews.length;

    // Filter out any incomplete reviews (ensuring each review has email)
    item.reviews = item.reviews.filter(
      (review) => review.username && review.rating !== undefined && review.comment && review.email
    );

    // Recalculate average rating
    item.rating = (
      item.reviews.reduce((acc, rev) => acc + rev.rating, 0) / item.reviews.length
    ).toFixed(1);

    await item.save();

    return res.status(200).json({ message: "Review added successfully", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});



module.exports = { itemRouter };
