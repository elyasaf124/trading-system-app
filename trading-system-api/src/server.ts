import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketIo } from "socket.io";
import app from "./app";
import { randomPriceSocket } from "./utilitis/randomPriceStock";

dotenv.config({ path: "./config.env" });

export const server = http.createServer(app);
export const io = new SocketIo(server, {
  cors: {
    origin: [
      "http://localhost:3001",
      "https://trading-system-cli.onrender.com",
    ],
  },
});

let intervalId: any;

const playFunctionCreateStock = () => {
  intervalId = setInterval(randomPriceSocket1, 50000);
  console.log("Playing the function...");
};

const stopFunctionCreateStock = () => {
  clearInterval(intervalId);
  console.log("Stopping the function...");
};

const randomPriceSocket1 = async () => {
  randomPriceSocket();
  console.log("Random price socket function called...");
};

io.on("connection", (socket) => {
  console.log("A client connected");

  playFunctionCreateStock();

  socket.on("disconnect", () => {
    console.log("A client disconnected");

    stopFunctionCreateStock();
  });
});

const DB = process.env.DATABASE as string;

mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err: Error) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
  });

const port = 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
