import React, { useState, useEffect } from "react";
import "./address.css";
import request from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import {
  alertSuccess,
  alertError,
} from "../../../swertalert/AlertSuccess";
import { getProfileCustomer } from "../../../store/ProfileUser";

const Address = () => {
  const [data, setData] = useState(null);

  const [state, setState] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const profileCustomer = getProfileCustomer();

  useEffect(() => {
    if (profileCustomer?.customer) {
      setData(profileCustomer.customer);
    }
  }, [profileCustomer]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!data?.id) {
      return alertError({
        text: "Customer information is not available.",
      });
    }

    try {
      setLoading(true);

      const payload = {
        customerID: data.id,
        street: state.street,
        city: state.city,
        state: state.state,
        zipCode: state.zipCode,
        country: state.country,
      };

      const res = await request(
        "/api/addresses",
        "POST",
        payload
      );

      if (res) {
        alertSuccess({
          text: res.message || "Address added successfully",
        });

        navigate("/index/loginpage");
      }
    } catch (err) {
      alertError({
        text:
          err?.response?.data?.message ||
          err.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div>
            <p className="small-title">ACCOUNT DETAILS</p>
            <h1>Register Your Address</h1>
          </div>
        </div>

        <form className="register-form" onSubmit={handleAdd}>
          <div className="form-grid">

            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                placeholder="Enter Street"
                value={state.street}
                onChange={(e) =>
                  setState({
                    ...state,
                    street: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter City"
                value={state.city}
                onChange={(e) =>
                  setState({
                    ...state,
                    city: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                placeholder="Enter State"
                value={state.state}
                onChange={(e) =>
                  setState({
                    ...state,
                    state: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                placeholder="Enter Zip Code"
                value={state.zipCode}
                onChange={(e) =>
                  setState({
                    ...state,
                    zipCode: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                placeholder="Enter Country"
                value={state.country}
                onChange={(e) =>
                  setState({
                    ...state,
                    country: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <button
            className="save-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <div className="register-footer">
            <p>
              Do you have an account?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate("/index/loginpage")
                }
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;