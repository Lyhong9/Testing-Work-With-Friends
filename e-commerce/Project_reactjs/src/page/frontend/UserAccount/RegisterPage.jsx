import React from "react";
import "./Register.css";
import request from "../../../utils/request";
import { useState, useEffect, useRef, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { alertSuccess, alertError } from "../../../swertalert/AlertSuccess";
import Category from "../../feature/Category/Category";
const imageUrl = 'https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg?s=612x612&w=0&k=20&c=ZBE3NqfzIeHGDPkyvulUw14SaWfDj2rZtyiKv3toItk=';
const RegisterPage = () => {
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

  const formData = new FormData();

  const MAX_PHOTO_SIZE_BYTES = 50 * 1024 * 1024; // 5MB in bytes
  const MAX_PHOTO_SIZE_MB = 50;

  const handleAdd = async (e) => {
    e.preventDefault();
    try{
      formData.append("name", state.username);
      formData.append("email", state.email);
      formData.append("password", state.password);
      formData.append("phone", state.phone);
      
      if(currentImage){
        formData.append("image", currentImage);
      }
      const res = await request("/api/customer", "POST", formData);
      if(res){
        alertSuccess({text: res.message});
        // navigate("/login");
      }
    }catch(err){
      alertError({text: err.message});
    }
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        if (file.size > MAX_PHOTO_SIZE_BYTES) {
          alertError({
            text: `Image too large. Please choose a file smaller than ${MAX_PHOTO_SIZE_MB}MB.`,
          });
          event.target.value = "";
          return;
        }
        setCurrentImage(file);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setState((prev) => ({ ...prev, image: reader.result || "" }));
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
              <input
                type="text"
                placeholder="Enter username"
                onChange={(e) =>
                  setState((pre) => ({
                    ...pre,
                    username: e.target.value,
                  }))
                }
              />
            </div>

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
            </div>

            <div className="form-group">
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

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                onChange={(e) =>
                  setState((pre) => ({
                    ...pre,
                    phone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                placeholder="Choose Image"
                onChange={handleImage}
              />
            </div>
            <div className="form-group">
              <div className="image-preview">
                <img src={currentImage ? state.image : imageUrl} alt="" width={100} height={100}/>
              </div>
            </div>
          </div>
          <button className="save-btn" type="submit">
            Register
          </button>
          <div className="register-footer">
            <p>
              Do you have an account?{" "}
              <span onClick={() => navigate("/index/login")}>
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
