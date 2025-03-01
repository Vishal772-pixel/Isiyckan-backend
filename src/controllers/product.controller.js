import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

// Get all products with optional category, sorting, pagination
// Get all products with optional category, sorting, pagination
export const getAllProducts = async (req, res) => {
  try {
    const { category, sort = 'createdAt', page = 1, limit = 10 } = req.query;

    // Set up the filter query based on category (if provided)
    const query = {};
    if (category && category !== 'All') {
      query.category = category; // Filter by category if not 'All'
    }

    // Fetch the products with pagination and sorting
    const products = await Product.find(query)
      .populate("category")
      .sort(sort)
      .limit(parseInt(1600))  // Make sure to parse the limit as an integer
      .skip((page - 1) * parseInt(1600)); // Skip for pagination logic

    // Count the total number of matching products
    const count = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / 16000),
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
// export const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, stock, images } = req.body;

//     console.log(req.body);

//     if (!name || !price || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, price, and category are required",
//       });
//     }

//     const product = new Product({
//       name,
//       description,
//       price,
//       category,
//       stock,
//       images,
//     });

//     console.log(product);

//     await product.save();

//     return res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



export const createProduct = async (req, res) => {
  try {
    const productsData = req.body; // Array of products

    console.log(productsData);

    // Check if the array is provided and each product contains the required fields
    // if (!Array.isArray(productsData) || productsData.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You must provide an array of products",
    //   });
    // }

    // Validate each product data
    const invalidProduct = productsData.find(
      (product) => !product.name || !product.price || !product.category
    );

    if (invalidProduct) {
      return res.status(400).json({
        success: false,
        message: "Each product must have a name, price, and category",
      });
    }

    // Use insertMany to insert multiple products at once
    const products = await Product.insertMany(productsData);

    console.log(products);

    return res.status(201).json({
      success: true,
      message: "Products added successfully",
      products,
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
