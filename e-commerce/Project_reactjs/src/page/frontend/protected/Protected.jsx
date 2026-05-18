import { Navigate } from "react-router-dom";
import {GetLocalCustomer} from "../../../store/LocalStorage";
const Protected = ({ children }) => {
  const token = GetLocalCustomer();

  // If not login → redirect to login page
  if (!token) {
    return <Navigate to="login" replace />;
  }

  // If login → show page
  return children;
};

export default Protected;