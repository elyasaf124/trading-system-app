import { Request, Response, NextFunction } from "express";
import { Company } from "../models/companyModule";
import { stripeAPI } from "../stripe";
import { StockPortfolio } from "../models/stockPortfolioModule";
import { User } from "../models/userModule";
import { AppError } from "../utilitis/appError";

export const getCheckoutSession = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let webOrigin = "";
  if (process.env.NODE_ENV === "development") {
    console.log("dev");
    webOrigin = process.env.WEB_APP_URL_DEV as string;
  } else if (process.env.NODE_ENV === "production") {
    console.log("prod!!");
    webOrigin = process.env.WEB_APP_URL_PROD as string;
  }
  const company = await Company.findById(req.params.id);
  if (company) {
    const session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: webOrigin as string,
      cancel_url: webOrigin as string,
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          quantity: req.query.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round((company?.stockPrice as number) * 100),
            product_data: {
              name: company?.name as string,
              description: company?.description,
            },
          },
        },
      ],
      mode: "payment",
      metadata: {
        userId: String(req.user._id),
        quantity: req.query.quantity,
        companyId: req.params.id,
        description: company?.description as string[0],
        name: company?.name as string,
        stockSymbol: company.stockSymbol as string,
        stockPrice: String(company.stockPrice),
        stockPrice2: company.stockPrice as number,
        type: req.query.type,
      },
    });
    res.status(200).json({
      status: "successs",
      sessionId: session.id,
    });
  }
};

export const createBookingCheackout = async (session: any, lineItems: any) => {
  let user: any;
  let company: any;

  const userEmail: any = (await User.findOne({ email: session.customer_email }))
    ?.id;
  user = await StockPortfolio.findOne({
    userIdRef: userEmail,
  });

  if (user && session.metadata.type === "sell") {
    company = await Company.findById(session.client_reference_id);

    const existingStock = user.stocks.find((stock: any) => {
      return (
        stock.companyIdRef.toString() === session.client_reference_id.toString()
      );
    });

    if (existingStock) {
      if (existingStock.quantityStocks - +session.metadata.quantity < 0) {
        throw new AppError("you can't sell more stock then what you have", 400);
      }
      if (existingStock.quantityStocks - +session.metadata.quantity === 0) {
        const index = user.stocks.findIndex((stock: any) => {
          return (
            stock.companyIdRef.toString() ===
            session.client_reference_id.toString()
          );
        });

        if (index !== -1) {
          user.stocks.splice(index, 1);
        }
      }
      existingStock.quantityStocks -= +session.metadata.quantity;
    }
    await user.save();
    return;
  }

  if (!user) {
    company = await Company.findById(session.client_reference_id);

    await StockPortfolio.create({
      userIdRef: userEmail,
      stocks: [
        {
          companyIdRef: session.client_reference_id,
          stockCompanyName: company?.name,
          stockPrice: company?.stockPrice,
          quantityStocks: session.metadata.quantity,
          icon: company?.icon,
          stockSymbol: company?.stockSymbol,
        },
      ],
    });
  } else {
    company = await Company.findById(session.client_reference_id);

    const existingStock = user.stocks.find((stock: any) => {
      return (
        stock.companyIdRef.toString() === session.client_reference_id.toString()
      );
    });

    if (existingStock) {
      existingStock.quantityStocks += +session.metadata.quantity;
    } else {
      user.stocks.push({
        companyIdRef: session.client_reference_id,
        stockCompanyName: company?.name,
        stockPrice: company?.stockPrice,
        quantityStocks: session.metadata.quantity,
        icon: company?.icon,
        stockSymbol: company?.stockSymbol,
      });
    }

    await user.save();
  }
};

export const webhookCheckout = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers["stripe-signature"];

  let event: any;
  try {
    event = stripeAPI.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const sessionWithLineItems = await stripeAPI.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      }
    );
    const lineItems = sessionWithLineItems.line_items;
    await createBookingCheackout(event.data.object, lineItems);
  }

  res.status(200).json({ recived: true });
};
