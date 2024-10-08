import { Request, Response, NextFunction } from "express";
import { Stock } from "../models/stockModule";
import { Company } from "../models/companyModule";
import mongoose, { Types } from "mongoose";

export const getAllStocks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: 1 });
    res.status(200).json({
      status: "success",
      stocks,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getStockByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("req.params.date", req.params.date);
    let matchCriteria: any;
    switch (req.params.date) {
      case "two-years":
        matchCriteria = {
          $match: {
            createdAt: {
              $gte: Date.now() - 2 * 365 * 24 * 60 * 60 * 100, // 2 years ago in Unix time
              $lte: Date.now(),
            },
          },
        };
        break;
      case "year":
        matchCriteria = {
          $match: {
            createdAt: {
              $gte: Date.now() - 365 * 24 * 60 * 60 * 100, // 1 year ago in Unix time
              $lte: Date.now(),
            },
          },
        };
        break;
      case "month":
        matchCriteria = {
          $match: {
            createdAt: {
              $gte: Date.now() - 30 * 24 * 60 * 60 * 100, // 30 days ago in Unix time
              $lte: Date.now(),
            },
          },
        };
        break;
      case "day":
        matchCriteria = {
          $match: {
            createdAt: {
              $gte: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago in Unix time
              $lte: Date.now(),
            },
          },
        };
        break;
      default:
        break;
    }
    const stocks = await Stock.aggregate([matchCriteria]).sort({
      createdAt: 1,
    });

    res.status(200).json({
      status: "success",
      stocks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getEarlyStockByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const desiredTimestamp = Date.now();
    const timeRange = req.params.timeRange;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const currentDateDay = Math.floor(currentDate.getTime() );
 

    let rangeMilliseconds = 0;
    if (timeRange === "day" || timeRange === "Today") {
      rangeMilliseconds = (desiredTimestamp - currentDateDay) ;
  } else if (timeRange === "Week") {
      rangeMilliseconds = 7 * 24 * 3600 * 1000;
  } else if (timeRange === "month" || timeRange === "Month") {
      rangeMilliseconds = 30 * 24 * 3600 * 1000;
  } else if (timeRange === "6 Month") {
      rangeMilliseconds = 6 * 30 * 24 * 3600 * 1000;
  } else if (timeRange === "year" || timeRange === "Year") {
      rangeMilliseconds = 365 * 24 * 3600 * 1000;
  } else if (timeRange === "two-years") {
      rangeMilliseconds = 2 * 365 * 24 * 3600 * 1000;
  } else if (timeRange === "5 Years") {
      rangeMilliseconds = 5 * 365 * 24 * 3600 * 1000;
  } else if (timeRange === "All time") {
      rangeMilliseconds = desiredTimestamp * 1000;
  }
    
    let ids = req.query.ids;
    if (typeof ids === "string") {
      ids = [ids];
    } else if (!Array.isArray(ids)) {
      ids = [];
    }

    const objectIdIds = ids.map(
      (id) => new mongoose.Types.ObjectId(id as string)
    );
    let data: any = await Company.aggregate([
      {
        $match: {
          _id: { $in: objectIdIds },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "companyIdRef",
          as: "stocks",
        },
      },
      {
        $project: {
          _id: 0,
          company: "$$ROOT",
          stocks: { $slice: ["$stocks", 80] }, // Limit to 100 stocks before filtering
        },
      },
      {
        $project: {
          company: 1,
          stocks: {
            $filter: {
              input: "$stocks",
              as: "stock",
              cond: {
                $and: [
                  {
                    $gte: [
                      "$$stock.createdAt",
                      desiredTimestamp - rangeMilliseconds,
                    ],
                  },
                  { $lt: ["$$stock.createdAt", desiredTimestamp + 86400] },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: "$stocks",
      },
      {
        $sort: {
          "stocks.createdAt": 1,
        },
      },
      {
        $group: {
          _id: "$company._id",
          company: { $first: "$company" },
          stocks: { $push: "$stocks" },
        },
      },
    ]);

    // if (timeRange !== "day" && timeRange !== "Today") {
    //   data[0].stocks = data[0].stocks.filter((stock: any) => {
    //     return stock.lastStockDay === true;
    //   });
    // }

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


export const getStasStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const desiredTimestamp = Date.now() / 1000;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let day = { date: "Today", price: desiredTimestamp - 24 * 3600 };
    let week = { date: "Week", price: desiredTimestamp - 7 * 24 * 3600 };
    let month = { date: "Month", price: desiredTimestamp - 30 * 24 * 3600 };
    let halfYear = {
      date: "6 Month",
      price: desiredTimestamp - 6 * 30 * 24 * 3600,
    };
    let year = { date: "Year", price: desiredTimestamp - 365 * 24 * 3600 };
    let fiveYears = {
      date: "5 Years",
      price: desiredTimestamp - 5 * 365 * 24 * 3600,
    };
    let all = { date: "All time", price: 0 };

    let arrDates = [day, week, month, halfYear, year, fiveYears, all];

    const id = new mongoose.Types.ObjectId(req.params.id);
    let stocks = await Stock.find({ companyIdRef: id }).sort({ createdAt: -1 });

    let arr: any = [];
    arrDates.forEach((date: any, i) => {
      let tempArr = stocks.filter((stock) => {
        // @ts-ignore
        return (
          stock.createdAt > date.price && stock.createdAt < desiredTimestamp
        );
      });
      let firstStock = tempArr[0];
      let lastStock = tempArr[tempArr.length - 1];
      if (lastStock.stockPrice && firstStock.stockPrice) {
        let price =
          ((lastStock.stockPrice - firstStock.stockPrice) /
            firstStock.stockPrice) *
          100;
        arr.push({ date: date.date, price: price });
      }
    });

    res.status(200).json({
      status: "success",
      arr,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
