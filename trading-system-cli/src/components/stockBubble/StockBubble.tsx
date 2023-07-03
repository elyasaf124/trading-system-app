import { useEffect, useState } from "react";
import "./stockBubble.css";
import { IStockAndCompany } from "../../types/companyTypes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type IStockAndCompanys = {
  data: IStockAndCompany;
};

const StockBubble = ({ data }: IStockAndCompanys) => {
  const navigate = useNavigate();
  const newData = useSelector((state: any) => state.stock.socktData);
  const [animate, setAnimate] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [price, setPrice] = useState(0);
  const [pricePercentageIncrease, setPricePercentageIncrease] = useState(0);
  let timeout: any;

  useEffect(() => {
    if (data.stocks && data.stocks.length > 0) {
      let firstStock;
      let lastStock;
      if (newData && newData.companyIdRef === data.company._id) {
        setPrice(newData.stockPrice);
        firstStock = data.stocks[0];
        let per =
          ((newData.stockPrice - firstStock.stockPrice) /
            firstStock.stockPrice) *
          100;
        setPricePercentageIncrease(per);
        return;
      }
      if (data.stocks.length > 0) {
        firstStock = data.stocks[0];
        lastStock = data.stocks[data.stocks.length - 1];
        let per =
          ((lastStock.stockPrice - firstStock.stockPrice) /
            firstStock.stockPrice) *
          100;
        setPricePercentageIncrease(per);
      }
    }
  }, [data, newData]);

  useEffect(() => {
    setShowPrice(true);
    timeout = setInterval(() => {
      setAnimate(true);
      setShowPrice((prevToggle) => !prevToggle);
      setTimeout(() => {
        setAnimate(false);
      }, 300);
    }, 3000);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  const goToStockPage = () => {
    navigate(`/company/${data.company._id}`);
  };

  return (
    <div onClick={() => goToStockPage()} className="stock-bubble-container">
      <div className="stock-bubble-icon-container">
        <img
          src={data.company.icon}
          className="stock-bubble-icon"
          alt="Company Icon"
        />
      </div>
      <div className="stock-bubble-status-container">
        <div className="stock-bubble-name">{data.company.stockSymbol}</div>
        <div
          className={`stock-bubble-desc ${
            animate ? "price-disappear" : "price-appear"
          }`}
        >
          {showPrice ? (
            <>
              <span className="stock-price">
                {price !== 0
                  ? price.toFixed(2)
                  : data.company.stockPrice.toFixed(2)}
              </span>
              <span> USD</span>
            </>
          ) : (
            <span
              className={
                pricePercentageIncrease > 0
                  ? "percentage green"
                  : "percentage red"
              }
            >
              {pricePercentageIncrease.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockBubble;
