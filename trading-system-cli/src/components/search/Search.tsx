import { useEffect, useState } from "react";
import "./search.css";
import SearchResults from "./searchResults/SearchResults";
import axios from "axios";
import { baseUrl } from "../../main";
import { useDispatch } from "react-redux";
import { setUnSearchMode } from "../../features/loginMoodSlice";
import { ICompany } from "../../types/companyTypes";

const Search = () => {
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [filterCompanies, setFilterCompanies] = useState<ICompany[]>([]);
  const [, setSearchWord] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    axios
      .create({ withCredentials: true })
      .get(`${baseUrl}/company`)
      .then((res) => {
        setCompanies(res.data.companies);
      });
  }, []);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchWord = e.target.value;
    setSearchWord(newSearchWord);

    if (newSearchWord === "") {
      setSearchActive(false);
    } else {
      setSearchActive(true);
      setFilterCompanies(
        companies.filter((comp) => {
          return comp.name
            .toLocaleLowerCase()
            .includes(newSearchWord.toLocaleLowerCase());
        })
      );
    }
  };
  return (
    <div
      className="search"
      onClick={() => {
        dispatch(setUnSearchMode());
      }}
    >
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="input-search-container">
          <input
            onChange={(e) => search(e)}
            type="text"
            className="input-search"
            placeholder="search..."
          />
        </div>
        <div className="search-results-box">
          {searchActive
            ? filterCompanies.map((company: ICompany) => {
                return <SearchResults key={company._id} {...company} />;
              })
            : companies.map((company: ICompany) => {
                return <SearchResults key={company._id} {...company} />;
              })}
        </div>
      </div>
    </div>
  );
};

export default Search;
