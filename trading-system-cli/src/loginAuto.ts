import axios from "axios";
import { baseUrl } from "./main";
import { setLogin, setUserDetails } from "./features/loginMoodSlice";
import { useDispatch } from "react-redux";

export const loginAuto = async () => {
  const dispatch = useDispatch();
  try {
    await axios
      .create({ withCredentials: true })
      .post(`${baseUrl}/user/login`, {
        email: "elyasaf124@WALLA.COM",
        password: "12345678",
      })
      .then((res) => {
        dispatch(setUserDetails(res.data.user));
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("userName", res.data.user.firstName);
        localStorage.setItem("login", "true");
        dispatch(setLogin());
      });
  } catch (error: any) {
    console.log(error);
  }
};
