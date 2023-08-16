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
    //current time in seconds
    const desiredTimestamp = Date.now() / 1000;
    console.log("desiredTimestamp", desiredTimestamp);
    const timeRange = req.params.timeRange;
    console.log("timeRange", timeRange);
    //current time in milliseconds
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    //the start of the current day in seconds
    const currentDateDay = Math.floor(currentDate.getTime() / 1000);

    let rangeSeconds = 0;

    if (timeRange === "day" || timeRange === "Today") {
      rangeSeconds = desiredTimestamp - currentDateDay; // 1 day in seconds
    } else if (timeRange === "Week") {
      rangeSeconds = 7 * 24 * 3600; // week days in seconds
    } else if (timeRange === "month" || timeRange === "Month") {
      rangeSeconds = 30 * 24 * 3600; // 30 days in seconds
    } else if (timeRange === "6 Month") {
      rangeSeconds = 6 * 30 * 24 * 3600; // half year in seconds
    } else if (timeRange === "year" || timeRange === "Year") {
      rangeSeconds = 365 * 24 * 3600; // 365 days in seconds
    } else if (timeRange === "two-years") {
      rangeSeconds = 2 * 365 * 24 * 3600; // 2 years in seconds
    } else if (timeRange === "5 Years") {
      rangeSeconds = 5 * 365 * 24 * 3600; // 5 years in seconds
    } else if (timeRange === "All time") {
      rangeSeconds = desiredTimestamp; // all time in seconds
    }

    console.log("less then", desiredTimestamp + 86400);
    console.log("greater then", desiredTimestamp - rangeSeconds);

    let ids = req.query.ids;
    if (typeof ids === "string") {
      ids = [ids]; // Convert single ID string to an array with one element
    } else if (!Array.isArray(ids)) {
      ids = []; // Set default value to an empty array
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
      { $sort: { createdAt: 1 } },
      {
        //check to match between the fields and add just one each match and add the match stock to the match company
        $lookup: {
          from: "stocks", //the name in the db not model
          localField: "_id", //the company field
          foreignField: "companyIdRef", //the stock field
          as: "stocks", //the name of the field can choose any name
        },
      },
      {
        //reshapes the output doc filtering the stocks array based on the specified conditions.
        $project: {
          _id: 0,
          company: "$$ROOT", //point to the entire doc
          stocks: {
            $filter: {
              input: "$stocks", //the array from $lookup stage
              as: "stock",
              cond: {
                // specifies the condition or filter criteria to apply to each element of the input array
                $and: [
                  //for multi condition
                  {
                    $gte: [
                      "$$stock.createdAt",
                      desiredTimestamp - rangeSeconds,
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
        $unwind: "$stocks", //take the all docs for stocks array and saprate them
      },
      {
        $sort: {
          "stocks.createdAt": 1, //sort them
        },
      },
      {
        $group: {
          //reconected
          _id: "$company._id",
          company: { $first: "$company" },
          stocks: { $push: "$stocks" },
        },
      },
      {
        $project: {
          company: 1,
          stocks: 1,
          // "company.stocks": 0, //0 = exclude the field, 1 = include
        },
      },
    ]);

    if (timeRange !== "day" && timeRange !== "Today") {
      data[0].stocks = data[0].stocks.filter((stock: any) => {
        return stock.lastStockDay === true;
      });
    }
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
