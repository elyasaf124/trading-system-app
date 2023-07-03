import { useState } from "react";
import "./register.css";
import { IUser } from "../../../types/userType";

const Register = ({ registerProp }: any) => {
  const [user, setUser] = useState<IUser>({
    firstName: undefined,
    lastName: undefined,
    userName: undefined,
    email: undefined,
    age: undefined,
    password: undefined,
    passwordConfirm: undefined,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const register = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    for (const field in user) {
      if (user[field as keyof IUser] === undefined) {
        setErrorMsg(`Please fill in the rest of the fields.`);
        return;
      }
    }

    registerProp(user);
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-title">Sign up with email</div>
        <div className="user-details-container">
          <div className="register-form">
            <div className="form-detail username-container">
              <label className="form-label">First name</label>
              <input
                onChange={(e) => handleChange(e)}
                id="firstName"
                className="form-input"
              />
            </div>
            <div className="form-detail username-container">
              <label className="form-label">Last name</label>
              <input
                onChange={(e) => handleChange(e)}
                id="lastName"
                className="form-input"
              />
            </div>
            <div className="form-detail username-container">
              <label className="form-label username-label">Username</label>
              <input
                onChange={(e) => handleChange(e)}
                id="userName"
                className="form-input username-input"
              />
            </div>
            <div className="form-detail email-container">
              <label className="form-label">Email</label>
              <input
                onChange={(e) => handleChange(e)}
                id="email"
                className="form-input"
              />
            </div>
            <div className="form-detail email-container">
              <label className="form-label">Age</label>
              <input
                onChange={(e) => handleChange(e)}
                id="age"
                className="form-input"
                min="18"
                type="number"
              />
            </div>
            <div className="form-detail password-container">
              <label className="form-label">Password</label>
              <input
                onChange={(e) => handleChange(e)}
                id="password"
                type="password"
                className="form-input"
              />
            </div>
            <div className="form-detail password-container">
              <label className="form-label">Password confirm</label>
              <input
                onChange={(e) => handleChange(e)}
                id="passwordConfirm"
                type="password"
                className="form-input"
              />
            </div>
          </div>
        </div>
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button onClick={(e) => register(e)} className="register-btn">
          Create account
        </button>
      </div>
    </div>
  );
};

export default Register;
