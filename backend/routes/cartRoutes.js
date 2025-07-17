const { Router } = require("express");
const Cart = require("../models/Cart");
const Items = require("../models/Items");
const auth = require("../middleware/userAuth");

const cartRouter = new Router();


cartRouter.use(auth);

cartRouter.get("", async (req, res) => {
  try {
    const userId = req.user;
    // console.log(userId);
    const response = await Cart.find({userId});
    const cartResponse = response[0].items;
    // console.log(cartResponse);
    let cartDispArray = [];

    cartDispArray = await Promise.all(
      cartResponse.map(async (eachItem)=>{
        // console.log(eachItem);
        let eachItemResponse = await Items.findById(eachItem.itemId);
        eachItemResponse = eachItemResponse.toObject();
        eachItemResponse.size=eachItem.size;
        eachItemResponse.quantity=eachItem.quantity;
        return eachItemResponse;
      })
    )
    
    
    // console.log(cartDispArray);

    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: cartDispArray });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Failed to retrieve data" });
  }
});

cartRouter.post("", async (req, res) => {
  try {
    const userId = req.user;
    // console.log(userId);
    const {itemId, size, quantity,weight} = req.body;
    // console.log(req.body);

    if (!itemId || !userId || !size || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    

    // const variant = item.variants.find((v) => v.size === size);
    // if (!variant) {
    //   return res
    //     .status(400)
    //     .json({ message: "Selected size is not available" });
    // }

    // if (!variant.available) {
    //   return res
    //     .status(400)
    //     .json({ message: "Selected variant is out of stock" });
    // }

    // const price = variant.price;
    // const totalPrice = price * quantity;

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
      // cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      // If item doesn't exist, add it to the cart
      cart.items.push({
        itemId,
        size,
        quantity,
        weight,
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

cartRouter.put("", async(req, res)=>{
  try{
    const userId = req.user;

    const {itemId, size, quantity,weight} = req.body;

    let cart = await Cart.findOne({userId});

    const existingItemIndex = cart.items?.findIndex(
      (cartItem) => (cartItem.itemId.toString()===itemId && cartItem.size===size)
    );

    // console.log(cart.items[existingItemIndex]);
    cart.items[existingItemIndex].quantity=quantity;

    await cart.save();

    return res.status(200).json({message:"Quantity changed succesfully"});

  }catch(e){
    console.log(e);
    res.status(400).json({error:e});
  }
})

cartRouter.delete("", async(req, res) =>{
  try{
    // console.log(req.body);
    const {itemId} = req.body;
    const userId = req.user;

    // console.log(itemId);
    // console.log(userId);
    await Cart.updateOne(
      {userId},
      {$pull:{items:{itemId}}}
    );
    res.status(200).json({message:"Item deleted from cart successfully"});
  }catch(e){
    console.log(e);
    res.status(400).json({message:"Failed to delete item", error:e});
  }
})

module.exports = { cartRouter };