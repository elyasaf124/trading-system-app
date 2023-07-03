import axios from "axios";
import "./accountPage.css";
import { useEffect, useState } from "react";
import { baseUrl } from "../../main";
import { User } from "../../types/userType";
import NavBar from "../../components/nevBar/NavBar";
import StockTable from "../../components/stockTable/StockTable";

const AccountPage = () => {
  const [user, setUser] = useState<User>();
  const [stockPortfolio, setStockPortfolio] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let userV: any;
    try {
      await axios
        .create({ withCredentials: true })
        .get(`${baseUrl}/user/getMe`)
        .then((res) => {
          userV = res.data.data.user;
          setUser(userV);
        });

      if (userV) {
        await axios
          .create({ withCredentials: true })
          .get(`${baseUrl}/stockPortfolio/${userV._id}`)
          .then((res) => {
            const stockPortfolioData = res.data.stockPortfolio;
            setStockPortfolio(stockPortfolioData);
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="account-page">
      <NavBar />
      <div className="account-page-container">
        <div className="account-page-top">{user?.firstName}</div>
        <div className="my-portfolio-container">
          {isLoading ? (
            <div>Loading...</div>
          ) : stockPortfolio ? (
            <StockTable stockPortfolio={stockPortfolio} />
          ) : (
            <div>No stock portfolio found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
