import React, { useState } from "react";
import "./Login.css";
import "./Register.css";
import request from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import { alertSuccess, alertError } from "../../../swertalert/AlertSuccess";
import {SetLocalCustomer} from "../../../store/LocalStorage";
import { setProfileCustomer } from "../../../store/ProfileUser";

const LoginPage = () => {
  
  const [state, setState] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate();



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
        SetLocalCustomer(res.access_token)
        setProfileCustomer(res)
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

        <form className="Login-form" onSubmit={handleAddLogin}>
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
          </div>

          <button className="save-btn" type="submit">
            Login
          </button>

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
