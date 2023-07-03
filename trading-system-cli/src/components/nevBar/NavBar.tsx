import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./navBar.css";
import axios from "axios";
import { baseUrl } from "../../main";
import { setLogout } from "../../features/loginMoodSlice";
import { useSelector } from "react-redux";

interface NavbarProps {
  isWhiteBackground?: boolean;
}

const NavBar = ({ isWhiteBackground }: NavbarProps) => {
  const navbarClassName = isWhiteBackground ? "company-page nav" : "nav";
  const login = useSelector((state: any) => state.auth.isLoggedIn);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = localStorage.getItem("userName");

  const logout = async () => {
    await axios
      .get(`${baseUrl}/user/logout`, { withCredentials: true })
      .then((res) => {
        if (res.data.status == "success") {
          localStorage.clear();
          dispatch(setLogout());
          navigate("/", { replace: true });
        }
      });
  };

  return (
    <div className={navbarClassName}>
      <div className="nav-container">
        <div className="nav-left">
          <span onClick={() => navigate("/")} className="nav-left-span">
            TradingView
          </span>
        </div>
        <div className="nav-right">
          <span className="nav-right-span"></span>
          {login !== true ? (
            <button onClick={() => navigate("/auth")} className="nav-right-btn">
              Get started
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate(`/account`)}
                className="nav-right-btn"
              >
                {userName?.toLocaleLowerCase()}
              </button>
              <button onClick={() => logout()} className="nav-right-btn">
                log out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
