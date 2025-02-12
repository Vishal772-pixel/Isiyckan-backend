import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

// Get all products with optional category, sorting, pagination
export const getAllProducts = async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) {
      query.category = category; // Filter by category
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(sort) // Sort by field, e.g., "price" or "-price" (descending)
      .limit(limit * 1) // Pagination limit
      .skip((page - 1) * limit); // Skip for pagination

    const count = await Product.countDocuments(query); // Total count of matching products

    return res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
