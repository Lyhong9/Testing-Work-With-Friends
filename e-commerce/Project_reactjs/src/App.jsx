import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./page/Dashboard";
import ProductsPage from "./page/ProductsPage";
import SalesPage from "./page/SalesPage";
import CustomersPage from "./page/CustomersPage";
import ReportsPage from "./page/ReportsPage";
import Category from "./page/feature/Category/Category";
import Brand from "./page/feature/Brand/Brand";
import Products from "./page/feature/Products/Products";
// import Dashboard from "./page/feature/Dashboard/Dashboard";
import Role from "./page/feature/Role/Role";
import Login from "./page/feature/User/Login";
import SalePos from "./page/feature/SalePos/SalePos";


const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} /> */}
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/products" element={<Products />} />
        <Route path="/role" element={<Role />} />
        <Route path="/salepos" element={<SalePos />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
