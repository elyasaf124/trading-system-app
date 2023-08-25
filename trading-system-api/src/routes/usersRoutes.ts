import express from "express";
import {
  auth,
  logOut,
  login,
  protect,
  signup,
} from "../controllers/authController";
import { stayAwake, getMe } from "../controllers/userController";

export const router = express.Router();

router.route("/register").post(signup);
router.route("/login").post(login);

router.route("/logout").get(protect, logOut);

router.route("/getMe").get(protect, getMe);
router.route("/stayAwake").get(stayAwake);
