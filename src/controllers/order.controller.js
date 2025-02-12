import { Order } from "../models/order.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const userId = req.user._id;

    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        userId: userId.toString()
      }
    });

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentId: paymentIntent.id
    });

    return res.status(201).json({
      success: true,
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort("-createdAt");

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};