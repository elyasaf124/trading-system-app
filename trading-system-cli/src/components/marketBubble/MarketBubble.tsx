import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IStockAndCompany } from "../../types/companyTypes";
import "./marketBubble.css";
import { setMarketSummarySelect } from "../../features/stockSlice";
import { useSelector } from "react-redux";

type IStockAndCompanys = {
  data: IStockAndCompany;
  dateString: String;
  getDataStockByDate: (e: any, id?: string) => void;
};

const MarketBubble = ({
  data,
  getDataStockByDate,
  dateString,
}: IStockAndCompanys) => {
  const dispatch = useDispatch();
  const newData = useSelector((state: any) => state.stock.socktData);
  const marketSelect = useSelector(
    (state: any) => state.stock.marketSummarySelect
  );
  const [pricePercentageIncrease, setPricePercentageIncrease] = useState(0);

  useEffect(() => {
    if (data.stocks && data.stocks.length > 0) {
      let firstStock;
      let lastStock;
      if (newData && newData.companyIdRef === data.company._id) {
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

  const selectMarketCompany = async () => {
    dispatch(setMarketSummarySelect(data.company._id));
    getDataStockByDate(dateString, data.company._id);
  };

  return (
    <div
      onClick={() => selectMarketCompany()}
      className={
        marketSelect === data.company._id
          ? "market-bubble-container select"
          : "market-bubble-container"
      }
    >
      <div className="market-bubble-icon-container">
        <img src={data.company.icon} className="market-bubble-icon" />
      </div>
      <div className="market-bubble-details">
        <div className="market-bubble-title">{data.company.name}</div>
        <div className="market-bubble-price-container">
          <div className="market-bubble-price">
            {newData && newData?.companyIdRef === data.company._id
              ? newData?.stockPrice.toFixed(2)
              : data.company.stockPrice.toFixed(2)}
            <span> USD</span>
          </div>
          <span
            className={
              pricePercentageIncrease > 0
                ? "market-bubble-price-percentage green"
                : "market-bubble-price-percentage red"
            }
          >
            {pricePercentageIncrease.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketBubble;
