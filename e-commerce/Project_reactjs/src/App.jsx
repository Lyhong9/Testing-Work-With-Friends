import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./page/Dashboard";
import ProductsPage from "./page/ProductsPage";
import SalesPage from "./page/SalesPage";
// import CustomersPage from "./page/CustomersPage";
import ReportsPage from "./page/ReportsPage";
import Category from "./page/feature/Category/Category";
import Brand from "./page/feature/Brand/Brand";
import Products from "./page/feature/Products/Products";
// import Dashboard from "./page/feature/Dashboard/Dashboard";
import Login from "./page/feature/User/Login";
import SalePos from "./page/feature/SalePos/SalePos";
import Register from "./page/feature/User/Register";
import SaleHistory from "./page/feature/saleHistory/SaleHistory";
import Role from "./page/feature/Setting/Role";
import ManageUser from "./page/feature/Setting/ManageUser";
import LowStockAlert from "./page/feature/Setting/LowStockAlert";
import Expanse from "./page/feature/expanse/Expanse";
import Inventory from "./page/feature/inventory/Inventory";
import Customer from "./page/feature/Customer/Customer";

import Homepage from "./page/frontend/Homepage/Homepage";
import Navbar from "./page/frontend/Navbar/Navbar";
import Footer from "./page/frontend/Footer/Footer";
import LayoutFront from "./page/frontend/Layout/LayoutFront";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} /> */}
        {/* <Route path="/customers" element={<CustomersPage />} /> */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/products" element={<Products />} />
        <Route path="/role" element={<Role />} />
        <Route path="/salepos" element={<SalePos />} />
        <Route path="/salehistory" element={<SaleHistory />} />
        <Route path="/manageuser" element={<ManageUser />} />
        <Route path="/lowstockalert" element={<LowStockAlert />} />
        <Route path="/expense" element={<Expanse />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customer />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Frontend Routes */}
      <Route path="/index" element={<Homepage />} />
      <Route path="*" element={<h2>Page not found</h2>} />
    </Routes>
  );
};

export default App;
