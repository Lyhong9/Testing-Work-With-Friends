import React from "react";
import "./login.css";
import { NavLink } from "react-router-dom";
import UseLogin from "../../../userContext/UseLogin";

const Login = () => {
  const {
    handleLogin,
    dataUser,
    setDataUser,
    fetchOtp,
    handleVerifyOtp,
    handleResetPassword,
    forgotPass,
    setForgotPass,
    verifiedOtp,
    // loading states
    loading,
    otpLoading,
    verifyLoading,
    resetLoading,
  } = UseLogin();

  return (
    <div className="header-login">
      <div className="form-login">
        <form onSubmit={handleLogin}>
          {/* TITLE */}
          <div className="title-login">
            <p>Welcome Back 👋</p>
            <span className="subtitle">Please login to your account</span>
          </div>

          {/* EMAIL */}
          <input
            type="email"
            style={{ marginBottom: "15px" }}
            value={dataUser.email}
            placeholder="Enter your email"
            required
            onChange={(e) =>
              setDataUser({ ...dataUser, email: e.target.value })
            }
          />

          {/* PASSWORD OR FORGOT FLOW */}
          {!forgotPass ? (
            <input
              type="password"
              value={dataUser.password}
              placeholder="Enter password"
              onChange={(e) =>
                setDataUser({ ...dataUser, password: e.target.value })
              }
            />
          ) : (
            <>
              {/* OTP STEP */}
              {!verifiedOtp ? (
                <>
                  <input
                    style={{ marginBottom: "15px" }}
                    type="text"
                    value={dataUser.otp}
                    placeholder="Enter OTP"
                    onChange={(e) =>
                      setDataUser({ ...dataUser, otp: e.target.value })
                    }
                  />

                  {!dataUser.otp ? (
                    <button type="button" onClick={fetchOtp} disabled={otpLoading}>
                      {otpLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyLoading}
                    >
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  )}
                </>
              ) : (
                /* NEW PASSWORD STEP */
                <input
                  style={{ marginBottom: "15px" }}
                  type="password"
                  value={dataUser.resetPass}
                  placeholder="New password"
                  onChange={(e) =>
                    setDataUser({ ...dataUser, resetPass: e.target.value })
                  }
                />
              )}
            </>
          )}

          {/* FORGOT PASSWORD TOGGLE */}
          {!forgotPass ? (
              <div className="extra-options">
                <NavLink to="" onClick={() => setForgotPass(!forgotPass)}>
                  Forgot password?
                </NavLink>
              </div>
            ) : null
          }

          {/* MAIN ACTION BUTTON */}
          {!forgotPass? (
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          ) : verifiedOtp ? (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetLoading}
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </button>
          ) : null}

          {/* REGISTER */}
          <div className="register-text">
            <p>
              Don’t have an account? <NavLink to="/register">Register</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;