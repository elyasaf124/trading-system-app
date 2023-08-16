import { io } from "../server";
import { Company } from "../models/companyModule";
import { Stock } from "../models/stockModule";

export const randomPriceSocket = async (setLast?: string) => {
  console.log("reandom run");
  try {
    const companies = await Company.find();

    companies.forEach(async (company) => {
      if (company.stockPrice) {
        const min = company.stockPrice - 100;
        const max = company.stockPrice + 100;
        const newPrice = Math.floor(Math.random() * (max - min + 1)) + min;

        let newStock;
        if (setLast === "lastStock") {
          newStock = await Stock.create({
            companyIdRef: company._id,
            stockPrice: newPrice,
            stockSymbol: company.stockSymbol,
            icon: company.icon,
            stockCompanyName: company.name,
            lastStockDay: true,
          });
        } else {
          newStock = await Stock.create({
            companyIdRef: company._id,
            stockPrice: newPrice,
            stockSymbol: company.stockSymbol,
            icon: company.icon,
            stockCompanyName: company.name,
          });
        }

        company.stockPrice = newPrice;
        await company.save();

        io.emit("newPrice", { newStock });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
