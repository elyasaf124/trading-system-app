import { createSlice } from "@reduxjs/toolkit";
import { IStockAndCompany } from "../types/companyTypes";

export const stockSlice = createSlice({
  name: "stock",
  initialState: {
    marketSummarySelect: "6453ec6963555dc9e246772d",
    socktData: [],
    companies: [],
    companiesAndStocks: <IStockAndCompany[]>[],
    selectCompanyByRange: [],
    updateList: false,
  },
  reducers: {
    setMarketSummarySelect: (state, action) => {
      console.log(action.payload);
      state.marketSummarySelect = action.payload;
    },
    setSocktData: (state, action) => {
      state.socktData = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setCompaniesAndStocks: (state, action) => {
      state.companiesAndStocks = action.payload;
    },
    setSelectCompanyByRange: (state, action) => {
      state.selectCompanyByRange = action.payload;
    },
    setUpdateCompaniesAndStocks: (state, action) => {
      const index = state.companiesAndStocks.findIndex(
        (data: IStockAndCompany) => {
          return data.company._id === action.payload.companyIdRef;
        }
      );
      state.companiesAndStocks[index]?.stocks.push(action.payload);
    },
    setUpdateList: (state) => {
      state.updateList = !state.updateList;
    },
  },
});

export const {
  setMarketSummarySelect,
  setSocktData,
  setCompanies,
  setCompaniesAndStocks,
  setUpdateCompaniesAndStocks,
  setSelectCompanyByRange,
  setUpdateList,
} = stockSlice.actions;

export default stockSlice.reducer;
