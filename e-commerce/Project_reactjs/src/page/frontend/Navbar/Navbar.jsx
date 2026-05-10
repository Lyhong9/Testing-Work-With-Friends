import React, { useEffect } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import ReorderIcon from "@mui/icons-material/Reorder";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
import {GetProductLocal} from "../../../store/LocalStorage";
import useStore from "../CustomHooks/HookS";

const Navbar = ({AlertSuccess}) => {
  const [isActive, setIsActive] = useState(false);
  const [product, setProduct] = useState(GetProductLocal());
  const { cate, setCate } = useStore();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const updateProduct = () => setProduct(GetProductLocal());
    updateProduct();
    window.addEventListener('storage', updateProduct);
    return () => window.removeEventListener('storage', updateProduct);
  }, [cate]);

  const handleMenu = () => {
    setIsActive(false);
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
          <li onClick={handleMenu}>
            <NavLink to="" end>
              Home
            </NavLink>
          </li> 
          <li onClick={handleMenu}>
            <NavLink to="shop">Shop</NavLink>
          </li>
          <li onClick={handleMenu}>
            <NavLink to="about">About</NavLink>
          </li>
          <li onClick={handleMenu}>
            <NavLink to="contact">Contact</NavLink>
          </li>
          <li onClick={handleMenu}>
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
          <div className="circle-cart">{product?.length}</div>
          <button>
            <Link to="shopcart">
              <LocalMallIcon />
            </Link>
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
