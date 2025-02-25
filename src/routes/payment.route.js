import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  processStripePayment,
  processSwishPayment,
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Payment routes
router.post("/stripe/create-payment", processStripePayment);
router.post("/swish/create-payment", processSwishPayment);
router.post("/razorpay/create-order", createRazorpayOrder);
router.post("/razorpay/verify-payment", verifyRazorpayPayment);

export default router;