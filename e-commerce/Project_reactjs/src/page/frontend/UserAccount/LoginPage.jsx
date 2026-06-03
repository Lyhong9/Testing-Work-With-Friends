import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
import Hookslogin from "../UserAccount/Hookslogin";
const LoginPage = () => {
  const {
    handleForgot,
    forgotPassword,
    setState,
    state,
    handleLogin,
    handleOPT,
    loadingOtp,
    handleVerifyOTP,
    loadingVerifyOtp,
    loadingVerify,
    loadingVerifySuccess,
    handleResetPassword
  } = Hookslogin();

  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div>
            <p className="small-title">ACCOUNT DETAILS</p>
            <h1>Login</h1>
          </div>

          <button className="edit-btn">Frontend editable</button>
        </div>

        <form className="Login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  email: e.target.value,
                }))
              }
            />
            {forgotPassword ? (
              loadingVerifyOtp ? (
                loadingVerifySuccess ? (
                  <>
                  <label>Reset Password</label>
                  <input
                    type="password"
                    placeholder="Enter Reset Password"
                    value={state.newPass}
                    onChange={(e) =>
                      setState((pre) => ({
                        ...pre,
                        newPass: e.target.value,
                      }))
                    }
                    required
                  />
                </>
                ):(
                  <>
                  <label>Verify OTP</label>
                  <input
                    type="password"
                    placeholder="Enter Verify OTP"
                    value={state.verifyOTP}
                    onChange={(e) =>
                      setState((pre) => ({
                        ...pre,
                        verifyOTP: e.target.value,
                      }))
                    }
                    required
                  />
                </>
                )
              ) : (
                <>
                  <label>Send OTP</label>
                  <input
                    type="password"
                    placeholder="Enter OTP"
                    value={state.OTP}
                    onChange={(e) =>
                      setState((pre) => ({
                        ...pre,
                        OTP: e.target.value,
                      }))
                    }
                    required
                  />
                </>
              )
            ) : (
              <>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={state.password}
                  onChange={(e) =>
                    setState((pre) => ({
                      ...pre,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </>
            )}
          </div>

          <div className="forgot-password">
            <a onClick={handleForgot}>forgot password</a>
          </div>

          {forgotPassword ? (
            loadingVerifyOtp ? (
              loadingVerifySuccess ?(<button
                className="save-btn"
                type="submit"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>):(
                <button
                className="save-btn"
                type="submit"
                onClick={handleVerifyOTP}
              >
                {
                  loadingVerify ? "Verifying OTP..." : "Verify OTP"
                }
              </button>
              )
            ) : (
              <button className="save-btn" type="submit" onClick={handleOPT}>
                {loadingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            )
          ) : (
            <button className="save-btn" type="submit" onClick={handleLogin}>
              Login
            </button>
          )}

          <div className="register-footer">
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/index/registerpage")}
                style={{
                  cursor: "pointer",
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
