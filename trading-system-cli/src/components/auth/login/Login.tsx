import "./login.css";
import { useState } from "react";

const Login = ({ loginProps, errorMessage }: any) => {
  console.log(errorMessage);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: any) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const login = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (user.email === "" || user.password === "") {
      setErrorMsg(`Please fill in the rest of the fields.`);
      return;
    }
    loginProps(user);
  };
  return (
    <div className="login">
      <div className="login-container">
        <div className="login-title">Sign in with email</div>
        <div className="user-details-container">
          <div className="login-form">
            <div className="email-container">
              <label className="email-label">Email</label>
              <input
                onChange={(e) => handleChange(e)}
                id="email"
                className="email-input"
              />
            </div>
            <div className="password-container">
              <label className="password-label">Password</label>
              <input
                onChange={(e) => handleChange(e)}
                id="password"
                type="password"
                className="password-input"
              />
              <span className="forgot-pass">
                I forgot password or can't sign in
              </span>
            </div>
            {errorMsg && <div className="error-message">{errorMsg}</div>}
            {errorMessage != "" ? (
              <div className="error-message">{errorMessage}</div>
            ) : null}
            <button onClick={(e) => login(e)} className="login-btn">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
