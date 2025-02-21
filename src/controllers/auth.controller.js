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
    console.log("🟢 Registration Request Received:", req.body); // 👀 Debugging Line

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error, try again later." });
  }
};
// login function

export const loginUser = async (req, res) => {
  try {
    console.log("🟢 Login Request Received:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found!");
      return res.status(404).json({ message: "User does not exist" });
    }

    console.log("🔍 Found User:", user);

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      console.log("❌ Password does not match!");
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
};