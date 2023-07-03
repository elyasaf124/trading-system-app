export interface Istock {
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

export interface StockPortsfolio {
  _id: string;
  companyIdRef: string;
  stockPrice: number;
  quantityStocks: number;
  createdAt: number;
  icon: string;
  stockCompanyName: string;
  stockSymbol: string;
}
