import React, { useEffect, useState } from "react";
import "./profile.css";
import { Mail, Phone, MapPin, ShoppingBag, Star, Award } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getProfileCustomer,

} from "../../../store/ProfileUser";
import { BaseURL } from "../../../utils/BaseURL";
import { alertError, alertSuccess } from "../../../swertalert/AlertSuccess";
import request from "../../../utils/request";
import dayjs from "dayjs";
import useStore from "../CustomHooks/HookS";

const Profile = () => {
  const profileCustomer = getProfileCustomer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [CurrentImage, setCurrentImage] = useState(null);
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    image: "",
  });

  const { setArress } = useStore();

  const [addressAlready, setAddressAlready] = useState(false);
  const location = useLocation();

  const handleUpdateAddress = () => {
    setArress(data?.addresses[0]?.id);
    navigate("/index/address");
    // alert(data?.addresses[0]?.id);
  };

  const getCustomer = async (customer) => {
    try {
      setLoading(true);
      const res = await request("/api/customer?search=" + customer, "get");
      console.log(res);
      setLoading(false);
      if (res) {
        setData(res.customers[0]);
        if (res.customers[0].addresses.length > 0) {
          setAddressAlready(true);
          // alertSuccess({
          //   text: "You already have an address",
          // });
        }
      }
    } catch (err) {
      alertError({
        text: err.response?.data?.message || err.message || "Login failed",
      });
    }
  };
  useEffect(() => {
    if (profileCustomer.customer?.id) {
      getCustomer(profileCustomer.customer?.id);
    }
  }, [profileCustomer.customer?.id]);

  // Refetch when returning to profile page
  useEffect(() => {
    if (location.pathname === "/index/profile" && profileCustomer.customer?.id) {
      getCustomer(profileCustomer.customer?.id);
    }
  }, [location.pathname, profileCustomer.customer?.id]);

  const SaveProfil = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      formData.append("id", data.id);
      formData.append("name", state.username);
      formData.append("email", state.email);
      formData.append("password", state.password);
      formData.append("phone", state.phone);
      if (CurrentImage) {
        formData.append("image", CurrentImage);
      }

      const res = await request("/api/customer", "PUT", formData);
      if (res) {
        alertSuccess({
          text: res.message || "Update successful",
        });
      }
    } catch (err) {
      alertError({
        text: err.response?.data?.message || err.message || "Login failed",
      });
    }
  };

  const MAX_PHOTO_SIZE_BYTES = 50 * 1024 * 1024; // 5MB in bytes
  const MAX_PHOTO_SIZE_MB = 50;
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

  const handleAddAddress = async () => {
    navigate("/index/address");
  };

  return (
    <>
      <section className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div>
              <span className="profile-label">CUSTOMER PROFILE</span>

              <h1>
                Manage your details, delivery preferences, and saved coffee
                addresses
              </h1>

              <p>
                This frontend-only account area is ready for backend integration
                later, while still feeling complete for customer flows now.
              </p>
            </div>

            <div className="quick-card">
              <span>QUICK ACCESS</span>
              <p>
                Jump back into the shop or review your cart before checkout.
              </p>

              <div className="quick-buttons">
                <button onClick={() => navigate("/index/shop")}>Browse coffees</button>
                <button onClick={() => navigate("/index/shopcart")}>View cart</button>
              </div>
            </div>
          </div>

          <div className="profile-main">
            {/* LEFT PROFILE CARD */}
            <div className="user-card">
              <div className="avatar-row">
                <div className="avatar">
                  <img
                    src={BaseURL + data.image}
                    alt="Avatar"
                    width={60}
                    height={60}
                  />
                </div>
                <span>COFFEE ACCOUNT</span>
              </div>

              <h2>{data.name}</h2>

              <p>
                Gold Member who prefers flat white and keeps deliveries smooth
                with saved addresses.
              </p>

              <ul>
                <li>
                  <Mail size={14} />
                  {data.email}
                </li>

                <li>
                  <Phone size={14} />
                  +855 {data.phone}
                </li>

                <li>
                  <MapPin size={14} />
                  {data.addresses?.length
                    ? data.addresses?.map(
                        (address) =>
                          address.street +
                          ", " +
                          address.city +
                          ", " +
                          address.state +
                          ", " +
                          address.zipCode +
                          ", " +
                          address.country,
                      )
                    : "No Address"}
                </li>
              </ul>

              <div className="profile-stats">
                <div>
                  <ShoppingBag size={15} />
                  <strong>24</strong>
                  <span>Orders delivered</span>
                </div>

                <div>
                  <Award size={15} />
                  <strong>1,280</strong>
                  <span>Reward points</span>
                </div>

                <div>
                  <Star size={15} />
                  <strong>Flat White</strong>
                  <span>Favorite brew</span>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="profile-form-card">
              <div className="form-title-row">
                <span>PROFILE DETAILS</span>
                <small>Frontend editable</small>
              </div>

              <h2>Customer information</h2>

              <form className="profile-form" onSubmit={SaveProfil}>
                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>Full name</label>
                    <input
                      type="text"
                      defaultValue={data.name}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      defaultValue={data.email}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>password</label>
                    <input
                      type="password"
                      defaultValue={data.password}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      defaultValue={data.phone}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>created_at</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={dayjs(data.createdAt).format("YYYY-MM-DD")}
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Updated_at</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={dayjs(data.updatedAt).format("YYYY-MM-DD")}
                    />
                  </div>
                </div>

                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>Upload Image</label>
                    <input type="file" onChange={handleImage} />
                  </div>
                  <div className="profile-input-group">
                    <label>
                      {data.image ? (
                        <img
                          src={
                            CurrentImage ? state.image : BaseURL + data.image
                          }
                          alt="Avatar"
                          width={80}
                          height={80}
                        />
                      ) : (
                        "No Image"
                      )}
                    </label>
                  </div>
                </div>

                <button type="submit" onClick={SaveProfil}>
                  Save profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="address-section">
        <div className="address-header">
          <div>
            <span className="address-label">ADDRESS BOOK</span>
            <h2>Saved addresses</h2>
            <p>
              Store shipping destinations for home, studio, or office coffee
              deliveries.
            </p>
          </div>

          {addressAlready ? (
            <button className="add-address-btn" onClick={handleUpdateAddress}>
              + Update address
            </button>
          ) : (
            <button className="add-address-btn" onClick={handleAddAddress}>
              + Add address
            </button>
          )}
        </div>

        <div className="address-grid ">
          <div className="address-card">
            <div className="address-card-top">
              <div>
                <div className="address-title-row">
                  <h3>Home</h3>
                  <span className="default-badge">Default</span>
                </div>

                <h4>Nora Patel</h4>
              </div>

              <div className="address-icon">{/* <Home size={18} /> */}</div>
            </div>

            <div className="address-info">
              <p>
                <MapPin size={17} />
                {data.addresses?.length
                  ? data.addresses?.map(
                      (address) =>
                        address.street +
                        ", " +
                        address.city +
                        ", " +
                        address.state +
                        ", " +
                        address.zipCode +
                        ", " +
                        address.country,
                    )
                  : "No Address"}
              </p>

              <p>
                <Phone size={17} />
                +885 {data.phone}
              </p>
            </div>

            <div className="address-actions">
              <strong>Used for your next coffee delivery</strong>
              <button>Remove</button>
            </div>
          </div>

          <div className="address-card">
            <div className="address-card-top">
              <div>
                <h3>Studio</h3>
                <h4>Nora Patel</h4>
              </div>

              <div className="address-icon">{/* <Home size={18} /> */}</div>
            </div>

            <div className="address-info">
              <p>
                <MapPin size={17} />
                {data.addresses?.length
                  ? data.addresses?.map(
                      (address) =>
                        address.street +
                        ", " +
                        address.city +
                        ", " +
                        address.state +
                        ", " +
                        address.zipCode +
                        ", " +
                        address.country,
                    )
                  : "No Address"}
              </p>

              <p>
                <Phone size={17} />
                +885 {data.phone}
              </p>
            </div>

            <div className="address-actions">
              <button className="make-default-btn">Make default</button>
              <button>Remove</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
