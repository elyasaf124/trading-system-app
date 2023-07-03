import express from "express";
import { getCheckoutSession } from "../controllers/stripeController";
import { protect } from "../controllers/authController";

export const router = express.Router();

router.post("/checkout-seesion/:id", protect, getCheckoutSession);
