import { Request, Response, NextFunction } from "express";
import { stripeAPI } from "../stripe";
import { StockPortfolio } from "../models/stockPortfolioModule";

export const createStockPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stock = await StockPortfolio.create(req.body);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getStockPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stockPortfolio = await StockPortfolio.find({
      userIdRef: req.params.id,
    });

    res.status(200).json({
      status: "success",
      stockPortfolio,
    });
  } catch (error) {
    console.log(error);
  }
};
