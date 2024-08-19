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
  dateFormat: String,
  stockSymbol: String,
  icon: String,
  stockCompanyNmae: String,
  lastStockDay: Boolean,
});

stockShcema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

export const Stock = mongoose.model("Stock", stockShcema);
