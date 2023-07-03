import express from "express";
import {
  getAllStocks,
  getEarlyStockByDate,
  getStasStock,
  getStockByDate,
} from "../controllers/stockController";

export const router = express.Router();

router.route("/").get(getAllStocks);
router.route("/getStockByDate/:date").get(getStockByDate);
router.route("/getEarlyStockByDate/:timeRange").get(getEarlyStockByDate);
router.route("/getStasStock/:id").get(getStasStock);
