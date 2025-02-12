// Auth is here for the login and Register Purpose 
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return { accessToken };
  } catch (error) {
    throw new Error("Something went wrong while generating tokens");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with email or username already exists"
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const { accessToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(201).json({
      success: true,
      user,
      accessToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist"
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const { accessToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(200).json({
      success: true,
      user,
      accessToken
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};