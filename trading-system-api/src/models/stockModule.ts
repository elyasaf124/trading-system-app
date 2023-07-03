import mongoose from "mongoose";

const stockShcema = new mongoose.Schema({
  companyIdRef: {
    required: [true, "stock must belong to a company"],
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  stockPrice: {
    type: Number,
    required: [true, "A stock must have a price"],
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  stockSymbol: String,
  icon: String,
  stockCompanyNmae: String,
  lastStockDay: Boolean,
});

stockShcema.pre("save", function (next) {
  this.createdAt = Date.now() / 1000;
  // const oneYearAgoTimestamp = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
  // const randomTimestamp =
  //   Math.floor(Math.random() * (Date.now() - oneYearAgoTimestamp + 1)) +
  //   oneYearAgoTimestamp;
  // this.createdAt = Math.floor(randomTimestamp / 1000);
  next();
});

export const Stock = mongoose.model("Stock", stockShcema);
