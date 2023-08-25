import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CompanyPage from "./pages/companyPage/CompanyPage";
import AccountPage from "./pages/accountPage/AccountPage";
import AuthPage from "./pages/auth/AuthPage";
import { useEffect } from "react";
import { socket } from "./socket";
import { updatedData } from "./utiltis/formetDate";
import { useDispatch } from "react-redux";
import { setSocktData } from "./features/stockSlice";
import { loginAuto } from "./loginAuto";
import { useSelector } from "react-redux";
import { stayActiveApi } from "./stayActiveApi";
import schedule from "node-schedule";

function App() {
  const dispatch = useDispatch();
  const login = useSelector((state: any) => state.auth.isLoggedIn);

  schedule.scheduleJob("*/1 * * * *", function () {
    import.meta.env.PROD ? stayActiveApi : "no";
  });

  if (!login) {
    const autoLogin = confirm("Do you want auto login?");
    if (autoLogin) {
      loginAuto();
    }
  }

  useEffect(() => {
    socket.connect();

    return () => {
      console.log("out");
    };
  }, []);

  useEffect(() => {
    const update = async (data: any) => {
      return await updatedData(data, "1");
    };

    socket.on("newPrice", (data: any) => {
      update(data).then((dataUpdate) => {
        dispatch(setSocktData(dataUpdate));
      });
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/company/:id" element={<CompanyPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </div>
  );
}

export default App;
