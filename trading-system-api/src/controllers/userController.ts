import { Request, Response, NextFunction } from "express";

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

export const stayAwake = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("stayAwake run!!");
    res.send("run");
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};
