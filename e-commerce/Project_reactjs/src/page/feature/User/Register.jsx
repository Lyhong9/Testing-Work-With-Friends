import GlobleData from "../../../store/GlobleData";
import "./register.css";
import { NavLink } from "react-router-dom";
import UseRegister from "../../../userContext/UseRegister";
import { alertError } from "../../../swertalert/AlertSuccess";
import request from "../../../utils/request";
import { useEffect, useState } from "react";
const Register = () => {
  const { dataUser, setDataUser, handleRegister } = UseRegister();
  const [role, setRole] = useState([]);

  useEffect(() => {
    fethchRole();
  }, []);

  const fethchRole = async () => {
    try {
      const res = await request("/api/role", "get");
      if (res) {
        setRole(res.data);
      }
    } catch (error) {
      alertError({ text: error?.message || "fetch Role Failed!" });
    }
  };

  return (
    <div className="header-login">
      <div className="form-login">
        <form onSubmit={handleRegister}>
          <div className="title-login">
            <p>Welcome Back 👋</p>
            <span className="subtitle">Please register to your account</span>
          </div>

          <div className="form-group" style={{ marginBottom: "30px" }}>
            <input type="text" placeholder="username" required 
                onChange={(e)=>setDataUser((prev)=>({
                    ...prev, username: e.target.value
                }))}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "30px" }}>
            <input
              type="email"
              name="email"
              value={dataUser.email || ""}
              placeholder="Enter your email"
              onChange={(e) =>
                setDataUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              name="password"
              value={dataUser.password || ""}
              placeholder="Enter your password"
              onChange={(e) =>
                setDataUser((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <select
              name=""
              id=""
              className="role-select"
              onChange={(e) =>
                setDataUser((prev) => ({ ...prev, role_id: e.target.value }))
              }
            >
              <option value="">Select Role</option>
              {role?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="status-select" style={{ marginBottom: "30px" }}>
            <select
              name=""
              id=""
              onChange={(e) =>
                setDataUser((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">Select Status</option>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <button type="submit">Register</button>

          {/* Register */}
          <div className="register-text">
            <p>
              Do you have an account? <NavLink to="/login">Login</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
