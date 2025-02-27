const { Router } = require("express");
const Cart = require("../models/Cart");
const Items = require("../models/Items");

const cartRouter = new Router();

cartRouter.get("", async (req, res) => {
  try {
    const response = await Cart.find();
    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: response });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Failed to retrieve data" });
  }
});

cartRouter.post("", async (req, res) => {
  try {
    const itemId = req.query.id;
    const { userId, size, quantity } = req.body;

    if (!itemId || !userId || !size || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const item = await Items.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const variant = item.variants.find((v) => v.size === size);
    if (!variant) {
      return res
        .status(400)
        .json({ message: "Selected size is not available" });
    }

    if (!variant.available) {
      return res
        .status(400)
        .json({ message: "Selected variant is out of stock" });
    }

    const price = variant.price;
    const totalPrice = price * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist, create a new one
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (cartItem) =>
        cartItem.itemId.toString() === itemId && cartItem.size === size
    );

    if (existingItemIndex !== -1) {
      // If item exists, update the quantity and total price
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      // If item doesn't exist, add it to the cart
      cart.items.push({
        itemId,
        size,
        quantity,
        price,
        totalPrice,
      });
    }

    // Save the cart
    await cart.save();
    res
      .status(201)
      .json({ message: "Item added to cart successfully", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

cartRouter.put("", async(req, res) =>{
  try{
    const {itemId, userId} = req.body;

    await Cart.updateOne(
      {userId},
      {$pull:{items:{itemId}}}
    );

    res.status(200).json({message:"Item deleted from cart successfully"});
  }catch(e){
    console.log(e);

  }
})

module.exports = { cartRouter };
