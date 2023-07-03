import { io } from "socket.io-client";

export let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  console.log("prod");
  baseUrl = "https://trading-system-api.onrender.com";
} else if (process.env.NODE_ENV === "development") {
  console.log("dev");
  baseUrl = "http://localhost:3000";
}

export const socket = io(baseUrl, {
  autoConnect: false,
});
