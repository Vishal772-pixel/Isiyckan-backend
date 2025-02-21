import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

// Token Generator Function
const generateAccessToken = (user) => {
  try {
    console.log("🔹 Generating access token for user:", user._id);
    return jwt.sign(
      { _id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET, // Ensure this is correctly set in .env
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
    );
  } catch (error) {
    console.error("❌ Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    console.log("🟢 Registration Request Received:", req.body);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.warn("⚠️ Missing Fields in Registration");
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already registered" });
    }

    console.log("🔹 Password before hashing:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔹 Hashed Password:", hashedPassword);

    // Save User
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("✅ User Registered Successfully:", newUser._id);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    console.log("🟢 Login Request Received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.warn("⚠️ Missing Email or Password");
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.warn("⚠️ User does not exist:", email);
      return res.status(404).json({ message: "User does not exist" });
    }

    console.log("🔹 Checking Password - Entered:", password, "Stored (Hashed):", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password); // FIXED

    if (!isPasswordValid) {
      console.warn("❌ Invalid password attempt for user:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User authenticated successfully:", user._id);
    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      accessToken
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Server error, try again later." });
  }
});

export default router;
export { generateAccessToken };

