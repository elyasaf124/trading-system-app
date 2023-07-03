import Stripe from "stripe";
import env from "dotenv";

env.config({ path: "./config.env" });
export const stripeAPI = new Stripe(
  process.env.STRIPE_SECRET_KEY_TEST as string,
  {
    apiVersion: "2022-11-15",
    typescript: true,
  }
);
