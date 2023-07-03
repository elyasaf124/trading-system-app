import { useNavigate } from "react-router-dom";
import { ICompany } from "../../../types/companyTypes";
import "./searchResults.css";
import { useDispatch } from "react-redux";
import { setUnSearchMode } from "../../../features/loginMoodSlice";

const SearchResults = (company: ICompany) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      className="search-results"
      onClick={() => {
        navigate(`/company/${company._id}`);
        dispatch(setUnSearchMode());
      }}
    >
      <div className="search-results-container">
        <div className="container">
          <img src={company.icon} alt="" className="img-result" />
          <span className="stock-symbol">{company.stockSymbol}</span>
        </div>
        <div className="container2">
          <span className="stock-name">{company.name}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
