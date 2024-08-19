import { useEffect, useState } from "react";
import { DonCheart } from "../charts/DonCheart";
import MarketBubble from "../marketBubble/MarketBubble";
import "./marketSummery.css";
import axios from "axios";
import { IStockAndCompany } from "../../types/companyTypes";
import { updatedData } from "../../utiltis/formetDate";
import { useSelector } from "react-redux";
import {
  setMarketSummarySelect,
  setSelectCompanyByRange,
  setUpdateCompaniesAndStocks,
} from "../../features/stockSlice";
import { useDispatch } from "react-redux";
import { baseUrl } from "../../main";

const MarketSummery = () => {
  const dispatch = useDispatch();
  const companiesAndStocks = useSelector(
    (state: any) => state.stock.companiesAndStocks
  );
  const newData = useSelector((state: any) => state.stock.socktData);
  const marketSummarySelect = useSelector(
    (state: any) => state.stock.marketSummarySelect
  );

  const [dateString, setDateString] = useState("day");

  useEffect(() => {
    if (newData) {
      dispatch(setUpdateCompaniesAndStocks(newData));
    }
  }, [newData]);

  const getDataStockByDate = async (e: any, id?: string) => {
    let dateStringVarb;
    let idCompany;
    if (typeof e === "string") {
      dateStringVarb = e;
      idCompany = id;
      dispatch(setMarketSummarySelect(id));
      setDateString(e);
    } else {
      idCompany = marketSummarySelect;
      setDateString(e.target.getAttribute("value"));
      dateStringVarb = e.target.getAttribute("value");
    }
    try {
      if (dateStringVarb) {
        await axios
          .get(
            `${baseUrl}/stock/getEarlyStockByDate/${dateStringVarb}?ids=${idCompany}`
          )
          .then(async (res) => {
            const stockByDate = await updatedData(res.data.data);
            dispatch(setSelectCompanyByRange(stockByDate));
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="market-summery">
      <div className="market-summery-container">
        <h3 className="market-summery-title">Market summery&gt;</h3>
        <ul className="market-summery-ul">
          <li className="market-summery-li selected">Stocks</li>
        </ul>
        <div className="markets-bubbles-box">
          {companiesAndStocks.map((data: IStockAndCompany) => {
            return (
              <MarketBubble
                key={data.company._id}
                data={data}
                getDataStockByDate={getDataStockByDate}
                dateString={dateString}
              />
            );
          })}
        </div>
        <DonCheart companiesAndStocks={companiesAndStocks} />
        <ul className="choose-range-ul">
          <li
            onClick={getDataStockByDate}
            className={`choose-range-li ${
              dateString === "day" ? "selected" : ""
            }`}
            value="day"
          >
            1D
          </li>
          <li
            onClick={getDataStockByDate}
            className={`choose-range-li ${
              dateString === "month" ? "selected" : ""
            }`}
            value="month"
          >
            1M
          </li>
          <li
            onClick={getDataStockByDate}
            className={`choose-range-li ${
              dateString === "year" ? "selected" : ""
            }`}
            value="year"
          >
            1Y
          </li>
          <li
            onClick={getDataStockByDate}
            className={`choose-range-li ${
              dateString === "two-years" ? "selected" : ""
            }`}
            value="two-years"
          >
            2Y
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MarketSummery;
