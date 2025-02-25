import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Transaction } from '../models/transaction.model.js';
import { Order } from '../models/order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Initialize Razorpay only if credentials are available
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
  });
}

// Credit Card Payment (Stripe)
export const processStripePayment = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }

    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'sek',
      metadata: { orderId }
    });

    const transaction = await Transaction.create({
      user: req.user._id,
      order: orderId,
      amount,
      paymentMethod: 'credit_card',
      paymentId: paymentIntent.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Swish Payment
export const processSwishPayment = async (req, res) => {
  try {
    const { amount, phoneNumber, orderId } = req.body;

    // Implement Swish payment logic here
    // This is a placeholder for the actual Swish implementation
    const swishPayment = {
      id: `swish_${Date.now()}`,
      status: 'pending'
    };

    const transaction = await Transaction.create({
      user: req.user._id,
      order: orderId,
      amount,
      paymentMethod: 'swish',
      paymentId: swishPayment.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      paymentDetails: swishPayment,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Razorpay Payment
export const createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay is not configured');
    }

    const { amount, orderId } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: orderId,
      payment_capture: 1
    });

    const transaction = await Transaction.create({
      user: req.user._id,
      order: orderId,
      amount,
      paymentMethod: 'razorpay',
      paymentId: razorpayOrder.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_SECRET) {
      throw new Error('Razorpay secret is not configured');
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      await Transaction.findOneAndUpdate(
        { paymentId: razorpay_order_id },
        { status: 'completed' }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};