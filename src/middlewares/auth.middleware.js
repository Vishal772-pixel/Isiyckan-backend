import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1]; // Supports 'Bearer <token>' format
    console.log("Token received for verification:", token);

    if (!token) {
      console.warn("Unauthorized request - No token provided");
      return res.status(401).json({
        success: false,
        message: "Unauthorized request: No token provided"
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    const user = await User.findById(decodedToken._id).populate("orders").select("-password"); // Populating orders for dashboard

    if (!user) {
      console.warn("Invalid Access Token - User not found:", decodedToken._id);
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token: User not found"
      });
    }

    req.user = user;
    console.log("User verified successfully:", user._id);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export const authenticateUser = async (req, res) => {
  try {
    const user = req.user; // Set by verifyJWT middleware
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        orders: user.orders
      }
    });
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
