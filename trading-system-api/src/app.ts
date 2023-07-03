import cookieParser from "cookie-parser";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { router as stockPortfolioRouter } from "./routes/stockPortfolioRoutes";
import { router as companyRouter } from "./routes/companyRoutes";
import { router as stockRouter } from "./routes/stockRoutes";
import { router as authRouter } from "./routes/usersRoutes";
import { router as stripeRouter } from "./routes/stripeRoutes";
import { globalErrorHandlerNew } from "./utilitis/appError";
import { randomPriceSocket } from "./utilitis/randomPriceStock";
import { webhookCheckout } from "./controllers/stripeController";
import cron from "node-cron";

dotenv.config({ path: __dirname + `./../config.env` });

export const corsOptions: any = {
  credentials: true,
  origin: [
    "http://localhost:3001",
    "https://trading-system-cli.onrender.com",
    "https://trading-system-api.onrender.com",
  ],
  optionsSuccessStatus: 200,
};

// setInterval(randomPriceSocket, 1000);

const app = express();
export default app;

cron.schedule("59 59 23 * * 0-4", function () {
  randomPriceSocket("setLast");
});

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(compression());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/company", companyRouter);
app.use("/stock", stockRouter);
app.use("/user", authRouter);
app.use("/stockPortfolio", stockPortfolioRouter);
app.use("/stripe", stripeRouter);

app.use(globalErrorHandlerNew);
