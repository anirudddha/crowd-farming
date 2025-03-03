const { Router } = require("express");
const Items = require("../models/Items");
const multer = require("multer");

const itemRouter = new Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

itemRouter.get("", async (req, res) => {
  try {
    const response = await Items.find();
    console.log(response);
    console.log(typeof response);
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
      const base64Images = req.files.map(file => "data:image/png;base64,"+file.buffer.toString("base64"));
  
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
  

module.exports = { itemRouter };
