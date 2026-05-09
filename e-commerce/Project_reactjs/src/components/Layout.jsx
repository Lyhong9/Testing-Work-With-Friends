import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../style/Layout.css";
import request from "../utils/request"
import GlobleData from "../store/GlobleData";
import { BaseURL } from "../utils/BaseURL";
import { alertError } from "../swertalert/AlertSuccess";
const Layout = ({stockAlert, OutOfstockAlert}) => {
  const {setBrand, setCategory, setRole} = GlobleData();


  useEffect(() => {
    fetchBrand();
   fetchCategory();
   fetchRole();
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
      // console.log(res);
      // setCategory(res.category)
      setCategory(res.categories);
    }catch(error){
      console.log(error);
    }
  }

  const fetchRole = async () =>{
    try{
        const res = await request("/api/role", "get");
        // console.log(res);
        if(res) { 
          setRole(res.role)
        }    
    }catch(error){
      alertError({text: error?.message || "fetch Role Failed!"})
    }
  }

  // action out of stock alert
  useEffect(() => {
  const interval = setInterval(() => {
      if(OutOfstockAlert){
        request("/api/outofstock", "get");
      }
  }, 3600000); // 1 hour

  return () => clearInterval(interval); // cleanup
  
}, [OutOfstockAlert]);

  // action low stock 
  useEffect(() => {
  const interval = setInterval(() => {
      request("/api/lowstock", "get");
  }, 3600000); // 1 hour

  return () => clearInterval(interval); // cleanup
}, [stockAlert]);
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
