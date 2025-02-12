import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

// Route to get all products (with optional query parameters for category, sorting, pagination)
router.get("/products", getAllProducts);

// Route to get a single product by its ID
router.get("/products/:id", getProductById);

export default router;
