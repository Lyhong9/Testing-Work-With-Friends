import React, { useEffect } from "react";
import "./profile.css";
import { Mail, Phone, MapPin, ShoppingBag, Star, Award } from "lucide-react";
import { getProfileUser, removeProfileUser } from "../../../store/ProfileUser";
const Profile = () => {
  useEffect(() => {}, []);
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
                <button>Browse coffees</button>
                <button>View cart</button>
              </div>
            </div>
          </div>

          <div className="profile-main">
            {/* LEFT PROFILE CARD */}
            <div className="user-card">
              <div className="avatar-row">
                <div className="avatar">NP</div>
                <span>COFFEE ACCOUNT</span>
              </div>

              <h2>Nora Patel</h2>

              <p>
                Gold Member who prefers flat white and keeps deliveries smooth
                with saved addresses.
              </p>

              <ul>
                <li>
                  <Mail size={14} />
                  nora@brewhaven.coffee
                </li>

                <li>
                  <Phone size={14} />
                  +66 555 0188
                </li>

                <li>
                  <MapPin size={14} />
                  Home, Bangkok
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

              <form className="profile-form">
                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>Full name</label>
                    <input type="text" defaultValue="Nora Patel" />
                  </div>

                  <div className="profile-input-group">
                    <label>Membership</label>
                    <input type="text" defaultValue="Gold Member" />
                  </div>
                </div>

                <div className="profile-input-row">
                  <div className="profile-input-group">
                    <label>Email</label>
                    <input type="email" defaultValue="nora@brewhaven.coffee" />
                  </div>

                  <div className="profile-input-group">
                    <label>Phone</label>
                    <input type="text" defaultValue="+66 555 0188" />
                  </div>
                </div>

                <div className="profile-input-group small-field">
                  <label>Preferred brew</label>
                  <input type="text" defaultValue="Flat White" />
                </div>

                <div className="profile-input-group">
                  <label>Delivery note</label>
                  <textarea
                    rows="5"
                    defaultValue="Please leave the order at the front desk after 6 PM."
                  ></textarea>
                </div>

                <button type="submit">Save profile</button>
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

          <button className="add-address-btn">+ Add address</button>
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
                88 Roast Street, Watthana, Bangkok 10110, Thailand
              </p>

              <p>
                <Phone size={17} />
                +66 555 0188
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
                16 Arabica Lane, Creative District, Bangkok 10330, Thailand
              </p>

              <p>
                <Phone size={17} />
                +66 555 0116
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
