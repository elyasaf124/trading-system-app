import { AiOutlineClose } from "react-icons/ai";
import "./authPage.css";
import Register from "../../components/auth/register/Register";
import Login from "../../components/auth/login/Login";
import { useState } from "react";
import { baseUrl } from "../../main";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUserDetails } from "../../features/loginMoodSlice";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerMode, setRegisterMode] = useState(true);
  const [, setErrorLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const register = async (user: any) => {
    try {
      await axios
        .post(`${baseUrl}/user/register`, {
          user: user,
        })
        .then(() => {
          login(user);
          navigate("/", { replace: true });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const login = async (user: any) => {
    try {
      await axios
        .create({ withCredentials: true })
        .post(`${baseUrl}/user/login`, {
          email: user.email,
          password: user.password,
        })
        .then((res) => {
          dispatch(setUserDetails(res.data.user));
          localStorage.setItem("email", res.data.user.email);
          localStorage.setItem("userName", res.data.user.firstName);
          localStorage.setItem("login", "true");

          dispatch(setLogin());
          navigate("/");
        });
    } catch (error: any) {
      setErrorLogin(true);
      setErrorMsg(error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container">
        <div className="left-side">
          <div className="img-container">
            <img
              className="auth-img"
              src="https://static.tradingview.com/static/bundles/desktop.05bbffcfa10ee78e12d1.webp"
            />
          </div>
        </div>
        <div className="right-side">
          <div className="right-side-top">
            <div className="right-side-top-container">
              <div></div>
              <div className="right-side-title">TradingView</div>
              <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <AiOutlineClose size="30px" opacity="0.5" />
              </div>
            </div>
          </div>
          {registerMode ? (
            <Register registerProp={register} />
          ) : (
            <Login loginProps={login} errorMessage={errorMsg} />
          )}
          <div className="buttom-line-container">
            {registerMode ? (
              <p className="buttom-line-text">
                Already have an account?{" "}
                <span
                  onClick={() => setRegisterMode(!registerMode)}
                  className="buttom-line-btn"
                >
                  Sign in
                </span>
              </p>
            ) : (
              <p className="buttom-line-text">
                Do not have an account?{" "}
                <span
                  onClick={() => setRegisterMode(!registerMode)}
                  className="buttom-line-btn"
                >
                  Sign up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
