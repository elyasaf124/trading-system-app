import express from "express";
import {
  createStockPortfolio,
  getStockPortfolio,
} from "../controllers/stockPortfolioController";
import { protect } from "../controllers/authController";

export const router = express.Router();

router.post("/", createStockPortfolio);
router.get("/:id", protect, getStockPortfolio);
