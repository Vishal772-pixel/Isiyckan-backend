import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  getCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// Routes for cart
router.post("/cart", addItemToCart); // Add item to cart
router.delete("/cart/:itemId", removeItemFromCart); // Remove item from cart
router.get("/cart", getCart); // Get all items in the cart

export default router;
