import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Token Generator Function
const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET, // Ensure this is correctly set in .env
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role // Default role for normal users
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    console.log("🟢 Login Request Received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found!");
      return res.status(404).json({ message: "User does not exist" });
    }

    // Check password
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = generateAccessToken(user);

    // Send response with role
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role in response
      },
      accessToken,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error, try again later." });
  }
};



// GET USER DASHBOARD (REAL-TIME DATA)
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("orders");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      address: user.address,
      orders: user.orders,
      transactions: user.transactions || [],
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
};

// UPDATE USER DASHBOARD
export const updateUserDashboard = async (req, res) => {
  try {
    const { address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { address }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Dashboard updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating dashboard:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
};
