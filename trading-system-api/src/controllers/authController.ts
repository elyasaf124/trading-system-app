import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModule";
import { AppError } from "../utilitis/appError";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config({ path: "../../config.env" });

export const auth = (req: any, res: Response, next: NextFunction) => {
  res.status(200).json({
    user: req.user,
  });
};

export const signToken = async (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRETT as string, {
    expiresIn: "90d",
  });
};

export const createSendToken = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = await signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    //קוקי נשלח רק בחיבור מאובטח
    secure: false,
    //דואג שהטוקן לא יוכל להשתנות או שיהיה אליו גישה על ידי הדפדפן
    httpOnly: false,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = "";
  user.passwordConfirm = "";

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newUser = await User.create({
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    userName: req.body.user.userName,
    age: req.body.user.age,
    email: req.body.user.email,
    password: req.body.user.password,
    passwordConfirm: req.body.user.passwordConfirm,
    role: req.body.user.role,
  });
  createSendToken(newUser, 201, res);

  next();
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError("you miss email or password details", 400);

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("there is incorrect password or email", 400);
    }

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() - 1),
    //קוקי נשלח רק בחיבור מאובטח
    secure: false,
    //דואג שהטוקן לא יוכל להשתנות או שיהיה אליו גישה על ידי הדפדפן
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = async (req: any, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next();

  // 2) Verification token
  try {
    // @ts-ignore
    const decoded: any = await promisify(jwt.verify)(
      token,
      // @ts-ignore
      process.env.JWT_SECRETT as string
    );

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new Error("User not found"));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    // Handle verification error
    return next(err);
  }
};

export const restrictTo = (...roles: any) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return console.log(
        "You do not have permission to perform this action",
        403
      );
    }
    next();
  };
};
