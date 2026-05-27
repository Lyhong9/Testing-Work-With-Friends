import { useState } from "react";
import {useNavigate} from "react-router-dom";
import request from "../../../utils/request";
import { alertSuccess, alertError } from "../../../swertalert/AlertSuccess";
import {SetLocalCustomer} from "../../../store/LocalStorage";
import { setProfileCustomer } from "../../../store/ProfileUser";

const Hookslogin = () => {
      const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
    OTP: "",
    resetPass: "",
    verifyOTP: "",
    newPass: "",
  });
  const handleForgot = () => {
    setForgotPassword(true);
  };

  const handleAddLogin = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        email: state.email,
        password: state.password,
      };

      const res = await request("/api/customer/login", "post", loginData);
      console.log(JSON.stringify(res));

      if (res) {
        SetLocalCustomer(res.access_token);
        setProfileCustomer(res);
        alertSuccess({
          text: res.message || "Login successful",
        });

        // save token if backend sends one
        // localStorage.setItem("token", res.token);

        navigate("/index/shopcart");
      }
    } catch (err) {
      alertError({
        text: err.response?.data?.message || err.message || "Login failed",
      });
    }
  };

  return {
    handleForgot,
    forgotPassword,
    state,
    setState,
    handleAddLogin,
  };
};

export default Hookslogin;
