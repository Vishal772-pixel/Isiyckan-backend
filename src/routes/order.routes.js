import express from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/create", createOrder);
router.get("/user-orders", getUserOrders);

export default router;