import { Navigate, Outlet } from "react-router-dom";
import {GetLocalCustomer} from "../../../store/LocalStorage";
import { useEffect } from "react";
const Protected = ({ children }) => {
  const token = GetLocalCustomer();
  
  useEffect(() => {
    console.log(token);
  }, []);

  // If not login → redirect to login page
  if (!token) {
    return <Navigate to="/index/loginpage" replace />;
  }

  // If login → show page
  return <Outlet />;
};

export default Protected;