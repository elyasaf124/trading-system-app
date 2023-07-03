import "./marketStock.css";
import { useState } from "react";
import { ICompany } from "../../types/companyTypes";
import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { baseUrl } from "../../main";

type ICompanyProps = {
  company?: ICompany;
};

const MarketStock = ({ company }: ICompanyProps) => {
  const stripe = useStripe();
  const [marketMode, setMarketMode] = useState("buy");
  const [quantityStock, setQuantityStock] = useState(0);

  const handleGuestCheckout = async () => {
    try {
      if (marketMode !== "" && quantityStock > 0) {
        await axios
          .create({ withCredentials: true })
          .post(
            `${baseUrl}/stripe/checkout-seesion/${company?._id}?quantity=${quantityStock}&&type=${marketMode}`
          )
          .then(async (res: any) => {
            const { sessionId } = res.data;
            if (stripe) {
              const { error } = await stripe.redirectToCheckout({
                sessionId,
              });
              if (error) {
                console.log(error);
              }
            }
          });
      } else {
        alert(
          "please choose buy or sell mode and quantity must be more then 1"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="market-stock">
      <div className="market-stock-container">
        <span className="market-stock-title">{company?.stockSymbol}</span>
        <div className="buy-sell-container">
          <div
            className={
              marketMode === "sell"
                ? "sell-container selected"
                : "sell-container"
            }
            onClick={() => setMarketMode("sell")}
          >
            <span>Sell</span>
            <span>{company?.stockPrice.toFixed(2)}</span>
          </div>
          <div
            className={
              marketMode === "buy" ? "buy-container selected" : "buy-container"
            }
            onClick={() => setMarketMode("buy")}
          >
            <span>Buy</span>
            <span>{company?.stockPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="quantity-stocks">
          <label className="title">Units</label>
          <div className="input-container">
            <input
              onChange={(e: any) => setQuantityStock(e.target.value)}
              placeholder="choose quantity stocks"
              type="number"
              className="quantity-stocks-input"
              min="0"
            />
          </div>
        </div>
        <button onClick={() => handleGuestCheckout()} className="buy-sell-btn">
          {marketMode === "sell" ? "sell" : "buy"}
        </button>
      </div>
    </div>
  );
};

export default MarketStock;
