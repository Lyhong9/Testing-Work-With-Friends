import React from "react";
import "./Login.css";
import "./Register.css";
import request from "../../../utils/request";
import { useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { alertSuccess, alertError } from "../../../swertalert/AlertSuccess";

const LoginPage = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    console.log(state);
  };


  return (
    <div className="register-container" onSubmit={handleAdd}>
      <div className="register-card">
        <div className="register-header">
          <div>
            <p className="small-title">ACCOUNT DETAILS</p>
            <h1>Login</h1>
          </div>

          <button className="edit-btn">Frontend editable</button>
        </div>

        <form className="Login-form">
          <div className="">
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
                onChange={(e) =>
                  setState((pre) => ({
                    ...pre,
                    password: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button className="save-btn" type="submit">
            Login
          </button>

          <div className="register-footer">
            <p>
              Don't have an account?{" "}
              <span onClick={() => navigate("/index/registerpage")}>Sign Up</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
