const { Router } = require("express");
const Items = require("../models/Items");
const multer = require("multer");
const User = require("../models/User");
const auth = require("../middleware/userAuth");
const itemRouter = new Router();

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

itemRouter.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    // Ensure at least one image file is provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is needed" });
    }

    // Convert each image file's buffer to a Base64 string
    const base64Images = req.files.map(file => "data:image/png;base64," + file.buffer.toString("base64"));

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
    } = req.body;

    // Parse variants if sent as a JSON string
    let parsedVariants = [];
    if (typeof variants === "string") {
      parsedVariants = JSON.parse(variants);
    } else {
      parsedVariants = variants;
    }

    // Parse weights if sent as a JSON string; otherwise, assume it's already an array
    let parsedWeights = [];
    if (typeof weights === "string") {
      parsedWeights = JSON.parse(weights);
    } else {
      parsedWeights = weights;
    }

    // Parse tags if sent as a JSON string; otherwise, assume it's already an array
    let parsedTags = [];
    if (typeof tags === "string") {
      parsedTags = JSON.parse(tags);
    } else {
      parsedTags = tags;
    }

    // Create a new item using all the provided fields along with the array of Base64 images
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
      reviews: Number(reviews),
      deliveryTime,
      tags: parsedTags,
      variants: parsedVariants,
      images: base64Images, // Save all images as an array of Base64 strings
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", data: newItem });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to add item" });
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
