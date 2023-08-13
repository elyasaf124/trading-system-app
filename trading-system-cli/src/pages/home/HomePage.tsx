import MarketSummery from "../../components/marketSummery/MarketSummery";
import NavBar from "../../components/nevBar/NavBar";
import StockBubble from "../../components/stockBubble/StockBubble";
import VideoSection from "../../components/videoSection/VideoSection";
import "./homePage.css";
import { AiOutlineSearch } from "react-icons/ai";
import { RiArrowDownSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ICompany, IStockAndCompany } from "../../types/companyTypes";
import { useDispatch } from "react-redux";
import { setCompanies, setCompaniesAndStocks } from "../../features/stockSlice";
import { baseUrl } from "../../main";
import CircleSpinner from "../../components/spinners/circleSpinner/CircleSpinner";
import Search from "../../components/search/Search";
import { setSearchMode } from "../../features/loginMoodSlice";
import { socket } from "../../socket";

const HomePage = () => {
  const dispatch = useDispatch();
  const newData = useSelector((state: any) => state.stock.socktData);
  const searchMode = useSelector((state: any) => state.auth.searchMode);
  const companiesAndStocks = useSelector(
    (state: any) => state.stock.companiesAndStocks
  );
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (newData) {
      const updateCompanies = companiesAndStocks.map((companies: ICompany) => {
        if (companies._id === newData.companyIdRef) {
          return {
            ...companies,
            stockPrice: newData.stockPrice,
          };
        }
        return companies;
      });
      dispatch(setCompanies(updateCompanies));
    }
  }, [socket, newData]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setShowSpinner(true);
    await axios
      .get(
        `${baseUrl}/stock/getEarlyStockByDate/day?ids=6453e8a7e8e11fff525c4498&ids=6453ec6963555dc9e246772d&ids=6453ecca63555dc9e246772f`
      )
      .then((res) => {
        setShowSpinner(false);
        const data = res.data.data;
        dispatch(setCompaniesAndStocks(data));
      });
  };

  return (
    <div className="home">
      <div className="home-first">
        {searchMode ? <Search /> : null}
        <div className="nav-box">
          <NavBar />
        </div>
        <img
          src="https://static.tradingview.com/static/bundles/leo-look-768.8381d51178dbec890175.jpg"
          alt=""
          className="home-img"
        />
        <div className="home-page-container">
          <div className="home-page-content">
            <div className="home-page-title-container">
              <h1 className="home-page-title">
                Look first / <br /> Then leap.
              </h1>
            </div>
            <p className="home-page-desc">
              The best trades require research, then <br /> commitment.
            </p>
            <div
              className="search-market"
              onClick={() => dispatch(setSearchMode())}
            >
              <div className="search-market-container">
                <div className="search-market-icon-container">
                  <div className="search-market-icon">
                    <AiOutlineSearch size="40px" />
                  </div>
                </div>
                <div className="search-market-span">Search markets here</div>
              </div>
            </div>
          </div>
          <div className="stock-bubble-box">
            {companiesAndStocks.map((data: IStockAndCompany) => {
              return !showSpinner ? (
                <StockBubble key={data.company._id} data={data} />
              ) : (
                <CircleSpinner key={data.company._id} />
              );
            })}
          </div>
          <div className="arrow-container">
            <div className="arrow-icon">
              <RiArrowDownSLine size="40px" />
            </div>
          </div>
        </div>
      </div>
      <VideoSection />
      <MarketSummery />
    </div>
  );
};

export default HomePage;
