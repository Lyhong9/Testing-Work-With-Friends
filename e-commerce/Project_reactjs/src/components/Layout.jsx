import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../style/Layout.css";
import request from "../utils/request"
import GlobleData from "../store/GlobleData";
import { BaseURL } from "../utils/BaseURL";
const Layout = () => {
  const {setBrand, setCategory} = GlobleData();


  useEffect(() => {
    fetchBrand();
   fetchCategory()
  }, []);
  const fetchBrand = async () => {
    try{
      const res = await request("/api/brand", "get");
      setBrand(res.brand);
    }catch(error){
      console.log(error);
    }
  }
  const fetchCategory = async () => {
    try{
      const res = await request("/api/category", "get");
      setCategory(res.categories);

    }catch(error){
      console.log(error);
    }
  }
  return (  
    <div className="app-container">
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
