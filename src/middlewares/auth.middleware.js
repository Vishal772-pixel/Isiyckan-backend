import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "");
    console.log("Token received for verification:", token);

    if (!token) {
      console.warn("Unauthorized request - No token provided");
      return res.status(401).json({
        success: false,
        message: "Unauthorized request"
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decodedToken);

    const user = await User.findById(decodedToken._id).select("-password"); // Ensure correct field

    if (!user) {
      console.warn("Invalid Access Token - User not found:", decodedToken._id);
      return res.status(401).json({
        success: false,
        message: "Invalid Access Token"
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
