import { RiArrowRightSLine } from "react-icons/ri";
import NavBar from "../../components/nevBar/NavBar";
import "./companyPage.css";
import { DonCheart } from "../../components/charts/DonCheart";
import axios from "axios";
import { useEffect, useState } from "react";
import { ICompany, IStockAndCompany } from "../../types/companyTypes";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MarketStock from "../../components/marketStock/MarketStock";
import { unixToDate } from "../../utiltis/unixToDate";
import { baseUrl } from "../../main";

const CompanyPage = () => {
  const { id } = useParams();
  const [companiesAndStocks, setCompaniesAndStocks] = useState<
    IStockAndCompany[]
  >([]);

  const [company, setCompany] = useState<ICompany>();
  const [stas, setStats] = useState<any[]>([]);
  const [dateSelect, setDateSelect] = useState("Today");
  const newData = useSelector((state: any) => state.stock.socktData);

  useEffect(() => {
    getComapny();
  }, []);

  const getComapny = async () => {
    await axios
      .get(`${baseUrl}/stock/getEarlyStockByDate/day?ids=${id}`)
      .then(async (res) => {
        setCompany(res.data.data[0].company);
        setCompaniesAndStocks(res.data.data);
      });
  };

  useEffect(() => {
    axios.get(`${baseUrl}/stock/getStasStock/${id}`).then((res) => {
      setStats(res.data.arr);
    });
  }, []);

  const getDataByDate = async (sta: any) => {
    await axios
      .get(`${baseUrl}/stock/getEarlyStockByDate/${sta.date}?ids=${id}`)
      .then(async (res) => {
        setCompany(res.data.data[0].company);
        setCompaniesAndStocks(res.data.data);
        setDateSelect(sta.date);
      });
  };

  return (
    <div className="company-page">
      <NavBar isWhiteBackground={true} />
      <div className="company-page-container">
        <div className="company-details-container">
          <div className="company-box">
            <div className="company-details-top">
              <img className="company-details-img" src={company?.icon} />
              <h1 className="company-details-name">{company?.name}</h1>
            </div>
            <div className="company-details-buttom">
              <h1 className="current-price">
                {company?.stockPrice.toFixed(2)}
                <span className="currency-type"> USD</span>
                <span className="price-precentage"> 5.23%</span>
              </h1>
              <span className="update-date">
                Last update at{" "}
                {newData.length != 0
                  ? `${newData?.date} ${newData?.hour}`
                  : unixToDate()}{" "}
                EDT
              </span>
            </div>
          </div>
          <MarketStock company={company} />
        </div>
        <div className="company-chart-container">
          <div className="company-chart-top">
            <h1 className="company-chart-title">
              {company?.stockSymbol} chart
            </h1>
            <RiArrowRightSLine size="36px" />
          </div>
          <DonCheart companiesAndStocks={companiesAndStocks} />
          <div className="date-bar-container">
            <ul className="date-bar-ul">
              {stas.map((sta) => {
                return (
                  <div
                    key={sta.date}
                    onClick={() => getDataByDate(sta)}
                    className={
                      dateSelect === sta.date
                        ? "date-bar-li-container selected"
                        : "date-bar-li-container"
                    }
                  >
                    <li className="date-bar-li date">{sta.date}</li>
                    <li
                      className={
                        sta.price > 0 ? "date-bar-li green" : "date-bar-li red"
                      }
                    >
                      {sta.price.toFixed(2)}%
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
