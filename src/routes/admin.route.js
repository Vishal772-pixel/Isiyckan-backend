import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import {
  getAdminDashboard,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(verifyJWT, isAdmin);

// Dashboard
router.get("/dashboard", getAdminDashboard);

// Product Management
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Order Management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;