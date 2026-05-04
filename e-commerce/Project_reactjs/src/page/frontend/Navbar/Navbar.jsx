import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  return (
    <header className="container header">
      {/* Profile */}
      <div className="header-profile">
        <div className="brand-icon">☕</div>
        <div className="header-profile-text">
          <span>BrewHaven</span>
          <span>Specialty Coffee Market</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header-body ${isActive ? "active" : ""}`}>
        <ul>
          <li>
            <NavLink to="" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="about">About</NavLink>
          </li>
          <li>
            <NavLink to="contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="profile">Profile</NavLink>
          </li>
        </ul>

        {/* Search */}
        <div className="search-body">
          <form className="search-form">
            <div>
              <i className="bi bi-search icon-search"></i>
              <input
                type="text"
                placeholder="search coffee..."
                className="search-input"
              />
            </div>
            <button type="submit">search</button>
          </form>
        </div>
      </nav>

      {/* Right Side */}
      <div className="header-search">
        <div className="cart-toggle">
          <div className="circle-cart"></div>
          <button>
            <LocalMallIcon />
          </button>
        </div>
        <div className="menu-toggle" onClick={handleToggle}>
          <button>
            {
              isActive ? (
                <CancelIcon />
              ) : (
                <ReorderIcon />
              )
            }
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
