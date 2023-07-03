import mongoose from "mongoose";

const stockPortfolioSchema = new mongoose.Schema({
  userIdRef: {
    // required: [true, "Stock must belong to a user"],
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  stocks: [
    {
      companyIdRef: {
        required: [true, "Stock must belong to a company"],
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      stockPrice: {
        type: Number,
        required: [true, "A stock must have a price"],
      },
      quantityStocks: Number,
      stockSymbol: String,
      icon: String,
      stockCompanyName: String,
      createdAt: {
        type: Number,
        default: Date.now,
      },
    },
  ],
});

export const StockPortfolio = mongoose.model(
  "StockPortfolio",
  stockPortfolioSchema
);
