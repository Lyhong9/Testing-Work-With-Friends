import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import request from "../utils/request";
import { alertError, alertSuccess } from "../swertalert/AlertSuccess";
import { SetLocalUser } from "../store/LocalStorage";

const UseLogin = () => {
  const [dataUser, setDataUser] = useState({
    email: "",
    password: "",
    otp: "",
    resetPass: "",
  });

  // separate loading states (better UX)
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [forgotPass, setForgotPass] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await request("/api/user/login", "POST", dataUser);

      alertSuccess({
        title: "Login success",
        text: "Login successfully!",
        timeout: 2000,
      });

      SetLocalUser(res.access_token);

      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      alertError({
        text: error?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND OTP =================
  const fetchOtp = async () => {
    setOtpLoading(true);

    try {
      const res = await request("/api/user/sendOTP", "POST", {
        email: dataUser.email,
      });

      if(res) {
        setShowOtpInput(true);
        alertSuccess({ title: "OTP sent" });
      }
    } catch (err) {
      alertError({ text: "Failed to send OTP" });
    } finally {
      setOtpLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    setVerifyLoading(true);

    try {
      const res = await request("/api/user/verifyOTP", "POST", {
        email: dataUser.email,
        otp: dataUser.otp,
      });

      setVerifiedOtp(true);
      alertSuccess({ title: "OTP verified" });
    } catch (err) {
      alertError({ text: "Invalid OTP" });
    } finally {
      setVerifyLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    setResetLoading(true);

    try {
      const res = await request("/api/user/resetPassword", "POST", {
        email: dataUser.email,
        newPassword: dataUser.resetPass,
      });

      if(res) {
        alertSuccess({
        title: "Password reset success",
        text: "You can now login",
      });

      setForgotPass(false);
      setVerifiedOtp(false);
      setDataUser({
        email: "",
        password: "",
        otp: "",
        resetPass: "",
      });
      }
    } catch (err) {
      alertError({ text: "Reset password failed" });
    } finally {
      setResetLoading(false);
    }
  };

  return {
    handleLogin,
    dataUser,
    setDataUser,
    fetchOtp,
    handleVerifyOtp,
    handleResetPassword,
    forgotPass,
    setForgotPass,
    verifiedOtp,
    showOtpInput,

    // loading states
    loading,
    otpLoading,
    verifyLoading,
    resetLoading,
  };
};

export default UseLogin;