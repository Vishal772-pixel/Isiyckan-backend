import express from "express";
import { registerUser, loginUser, getUserDashboard, updateUserDashboard } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Dashboard Routes (Protected)
router.get("/dashboard", authenticateUser, getUserDashboard);
router.put("/dashboard", authenticateUser, updateUserDashboard);

export default router;
