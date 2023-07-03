export interface ICompany {
  _id: string;
  name: string;
  description: string;
  founded: number;
  stockPrice: number;
  numberOfStockes: number;
  marketValue: number;
  CEO: string;
  __v: number;
  stockSymbol: string;
  icon?: string;
}

export interface IStockAndCompany {
  company: {
    _id: string;
    name: string;
    description: string;
    founded: number;
    stockPrice: number;
    numberOfStockes: number;
    marketValue: number;
    CEO: string;
    __v: number;
    stockSymbol: string;
    icon?: string;
  };
  stocks: [
    {
      _id: string;
      stockPrice: number;
      createdAt: number;
      stockSymbol: string;
      icon: string;
      stockCompanyName: string;
      date?: string;
      companyIdRef: string;
      hour?: string;
    }
  ];
}
