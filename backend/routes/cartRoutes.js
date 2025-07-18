const { Router } = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/userAuth");

const cartRouter = new Router();

// Use authentication middleware for all cart routes
cartRouter.use(auth);

/**
 * @route   GET /
 * @desc    Get the user's cart with populated item details
 * @access  Private
 */
cartRouter.get("", async (req, res) => {
  try {
    const userId = req.user;

    // Find the cart and populate all item details in a single, efficient query
    const cart = await Cart.findOne({ userId }).populate("items.itemId");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "Your cart is empty.",
        data: { items: [], summary: { subtotal: 0, totalItems: 0, grandTotal: 0 } },
      });
    }

    let subtotal = 0;

    const formattedCartItems = cart.items.map(cartItem => {
      const productDetails = cartItem.itemId;
      if (!productDetails) return null; // Handle case where item might have been deleted

      const { quantity, size, weight } = cartItem;
      const selectedVariant = productDetails.variants.find(v => v.size === size);
      if (!selectedVariant) return null; // Handle case where variant might have been deleted

      const itemTotal = quantity * selectedVariant.price;
      subtotal += itemTotal; // Calculate subtotal here

      return {
        cartItemId: cartItem._id,
        id: productDetails._id,
        name: productDetails.name,
        brand: productDetails.brand,
        image: productDetails.images[0]?.url || '',
        farmName: productDetails.farmName,
        category: productDetails.category,
        quantity: quantity,
        size: size,
        weight,weight,
        price: selectedVariant.price,
        itemTotal: parseFloat(itemTotal.toFixed(2)),
      };
    }).filter(item => item !== null);

    res.status(200).json({
      message: "Cart data retrieved successfully",
      data: {
        items: formattedCartItems,
        summary: {
          // --- FIXED: Providing a complete summary from the backend ---
          subtotal: parseFloat(subtotal.toFixed(2)),
          totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          grandTotal: parseFloat(subtotal.toFixed(2)), // For simplicity, grandTotal is same as subtotal here. Shipping is a frontend concern.
        }
      },
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to retrieve cart data", error: e.message });
  }
});

/**
 * @route   POST /
 * @desc    Add an item to the cart, or update quantity if it exists
 * @access  Private
 */
cartRouter.post("", async (req, res) => {
  try {
    const userId = req.user;
    const { itemId, size, quantity, weight } = req.body;

    if (!itemId || !size || !quantity) {
      return res.status(400).json({ message: "itemId, size, and quantity are required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === itemId && item.size === size
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, size, quantity, weight });
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart successfully", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   PUT /
 * @desc    Update the quantity of a specific item in the cart
 * @access  Private
 */
cartRouter.put("", async (req, res) => {
  try {
    const userId = req.user;
    const { itemId, size, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    await Cart.updateOne(
      { userId, "items.itemId": itemId, "items.size": size },
      { $set: { "items.$.quantity": quantity } }
    );

    res.status(200).json({ message: "Quantity changed successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   DELETE /
 * @desc    Remove an item from the cart
 * @access  Private
 */
cartRouter.delete("", async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.user;

    await Cart.updateOne(
      { userId },
      { $pull: { items: { itemId: itemId, size: size } } }
    );

    res.status(200).json({ message: "Item deleted from cart successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Failed to delete item", error: e.message });
  }
});

module.exports = { cartRouter };