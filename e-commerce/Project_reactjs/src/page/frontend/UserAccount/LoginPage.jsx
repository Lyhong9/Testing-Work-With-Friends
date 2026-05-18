import React from "react";
import "./Login.css";
import request from "../../../utils/request";
import { useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {alertSuccess, alertError} from "../../../swertalert/AlertSuccess"

const LoginPage = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    image: ""
  })

  const [ loading, setLoading ] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    console.log(state);
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentImage(reader.result);
    };
    reader.readAsDataURL(file);
  };


  return (
    <div className="register-container" onSubmit={handleAdd}>
      <div className="register-card">

        <div className="register-header">
          <div>
            <p className="small-title">ACCOUNT DETAILS</p>
            <h1>Register Account</h1>
          </div>

          <button className="edit-btn">Frontend editable</button>
        </div>

        <form className="register-form">

          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter username" onChange={(e) => setState(pre =>
                ({
                  ...pre,
                  username: e.target.value
                })
              )} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email" onChange={e => setState(pre =>
                ({
                  ...pre,
                  email: e.target.value
                })
              )}/>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter password" onChange={e => setState(pre =>
                ({
                  ...pre,
                  password: e.target.value
                })
              )}/>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="text" placeholder="Enter phone number" onChange={e => setState(pre =>
                ({
                  ...pre,
                  phone: e.target.value
                })
              )}/>
            </div>
            <div className="form-group">
              <label>Image</label>
              <input type="file" placeholder="Choose Image" onChange={handleImage}/>
            </div>
            <div className="form-group">
              <div>
                <img src={currentImage} alt="" />
              </div>
            </div>
          </div>
          <button className="save-btn" type="submit">Register</button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;