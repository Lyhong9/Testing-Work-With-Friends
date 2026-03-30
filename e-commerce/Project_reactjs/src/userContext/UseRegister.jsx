import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import request from "../utils/request";
import { alertError, alertSuccess } from "../swertalert/AlertSuccess";
import { SetLocalUser } from "../store/LocalStorage";

const UseRegister = () => {
  const [dataUser, setDataUser] = useState({
    email: "",
    password: "",
    role_id: "",
    username: "",
    status: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await request("/api/user", "POST", dataUser);
      
      if (res) {
        alertSuccess({
          title: "Registration success",
          text: "You have been registered successfully!",
          timeout: 2000,
        });

  ;
        navigate("/login");
      } 
    } catch (error) {
      alertError({
        text: error?.response?.data?.message || "Registration failed",
      });
    }
  };

  return {
    handleRegister,
    dataUser,
    setDataUser,
  };
};

export default UseRegister;