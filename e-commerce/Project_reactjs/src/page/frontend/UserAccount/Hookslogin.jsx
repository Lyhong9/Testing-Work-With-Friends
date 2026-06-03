import { useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "../../../utils/request";
import { alertSuccess, alertError } from "../../../swertalert/AlertSuccess";
import { SetLocalCustomer } from "../../../store/LocalStorage";
import { setProfileCustomer } from "../../../store/ProfileUser";

const Hookslogin = () => {
  const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingVerifySuccess, setLoadingVerifySuccess] = useState(false);
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

  const handleLogin = async (e) => {
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

  const handleOPT = async (e) => {
    e.preventDefault();
    try {
      setLoadingOtp(true);
      setLoadingVerifyOtp(false);
      const res = await request("/api/customer/sendOTP", "post", {
        email: state.email,
      });
      if (res) {
        setLoadingOtp(false);
        setLoadingVerifyOtp(true);
        alertSuccess({
          text: res.message || "OTP sent successfully",
        });
      }
    } catch (err) {
      alertError({
        text:
          err.response?.data?.message ||
          err.message ||
          "OTP verification failed",
      });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const verifyData = {
        email: state.email,
        otp: state.verifyOTP,
      };
      setLoadingVerify(true);
      setLoadingVerifySuccess(false);
      const res = await request("/api/customer/verifyOTP", "post", {
        ...verifyData,
      });
      if (res) {
        setLoadingVerify(false);
        setLoadingVerifySuccess(true);
        alertSuccess({
          text: res.message || "OTP verified successfully",
        });
      }
    } catch (err) {
      alertError({
        text:
          err.response?.data?.message ||
          err.message ||
          "OTP verification failed",
      });
    }
  };

  const handleResetPassword = async (e) => {
    {
      e.preventDefault();
      try{
        const res = await request("/api/customer/resetPassword", "post", {
          email: state.email,
          newPassword: state.newPass,
        })
        if(res){
          setForgotPassword(false);
          alertSuccess({
            text: res.message || "Password reset successfully",
          });
        
        }
      }catch(err){
        alertError({
          text: err.response?.data?.message
          || err.message  
          || "OTP verification failed", 
        });
      }
    }
  };

  return {
    handleForgot,
    forgotPassword,
    state,
    setState,
    handleLogin,
    handleOPT,
    loadingOtp,
    handleVerifyOTP,
    loadingVerifyOtp,
    loadingVerify,
    loadingVerifySuccess,
    handleResetPassword,
  };
};

export default Hookslogin;
