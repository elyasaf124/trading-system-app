import express from "express";
import {
  createCompany,
  getAllCompanys,
  getCompanysById,
} from "../controllers/companyController";

export const router = express.Router();

router.route("/").post(createCompany);
router.route("/").get(getAllCompanys);
router.route("/getCompanysById").get(getCompanysById);
