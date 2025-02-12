import Cart from "../models/Cart.js";  // Cart model import
import Product from "../models/Product.js";  // Product model import (agar zarurat ho)

export const addItemToCart = async (req, res) => {
  const { itemId, quantity } = req.body; // Cart mein add hone wala product ID aur quantity
  const userId = req.user.id;  // User ka ID (JWT ke through)

  try {
    // Check if item already exists in cart
    let cartItem = await Cart.findOne({ userId, itemId });

    if (cartItem) {
      // Agar item already cart mein hai, to quantity update karein
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: "Item updated in cart", cartItem });
    }

    // Agar item pehli baar add ho raha hai
    const newItem = new Cart({
      userId,
      itemId,
      quantity,
    });
    
    await newItem.save();
    res.status(201).json({ message: "Item added to cart", newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    // Find item in cart and remove it
    const deletedItem = await Cart.findOneAndDelete({ userId, itemId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    res.status(200).json({ message: "Item removed from cart", deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error });
  }
};
