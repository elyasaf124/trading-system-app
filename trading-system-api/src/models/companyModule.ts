import mongoose from "mongoose";

const companyShcema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A movie must have a name"],
    minlength: [2, "A cinema name must have more or equal then 2 characters"],
  },
  description: {
    type: String,
  },
  founded: Number,
  stockPrice: {
    type: Number,
    required: [true, "company must have stock price"],
  },
  numberOfStockes: {
    type: Number,
    required: [true, "company must have number of stock"],
  },
  marketValue: Number,
  CEO: String,
  stockSymbol: String,
  icon: {
    type: String,
    required: [true, "company must have icon"],
  },
});

export const Company = mongoose.model("Company", companyShcema);
