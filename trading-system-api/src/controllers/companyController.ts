import { Request, Response, NextFunction } from "express";
import { Company } from "../models/companyModule";

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.create(req.body);

    res.status(200).json({
      status: "success",
      company,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCompanys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await Company.find();

    res.status(200).json({
      status: "success",
      companies,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanysById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.query.ids) {
      const ids = req.query.ids;
      const companies = await Company.find({ _id: { $in: ids } });
      res.status(200).json({
        status: "success",
        companies,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
