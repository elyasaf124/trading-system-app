import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./features/store.ts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51NBcnOBLgBLv480XePRPEjza4aQhELLuF70eu4KZMKSblgF5zd85BsJxquIoLqL0Cogugkp9AfdHBFI54OqxrJ4Q000inBjXBW"
);

export let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  console.log("prod");
  disableReactDevTools();
  baseUrl = "https://trading-system-api.onrender.com";
} else if (process.env.NODE_ENV === "development") {
  console.log("dev");
  baseUrl = "http://localhost:3000";
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
