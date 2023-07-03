import { StockPortsfolio } from "./stockTypes";

export interface User {
  _id: string;
  age: number;
  createdAt: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userName: string;
}

export interface UserPortfolio {
  _id: string;
  userIdRef: string;
  stocks: StockPortsfolio[];
}

export interface IUser {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  age?: string;
  password?: string;
  passwordConfirm?: string;
}
