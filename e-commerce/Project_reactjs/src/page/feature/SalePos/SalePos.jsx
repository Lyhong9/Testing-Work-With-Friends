import React from "react";
import "./salePos.css";
import { useState } from "react";
import { useEffect } from "react";
import request from "../../../utils/request";
import { BaseURL } from "../../../utils/BaseURL";
import {
  alertError,
  alertSuccess,
  confirmDelete,
} from "../../../swertalert/AlertSuccess";
const SalePos = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await request("/api/product", "GET");
      console.log(res);
      if (res) {
        setProducts(res.product);
      }
    } catch (error) {
      alertError({ text: error?.message || "fetch products Failed!" });
    }
  };

  return (
    <div className="sale-container">
      <div className="right"  style={{ marginBottom: "5rem"}}>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img
                src={BaseURL + product.image}
                alt={product.name}
                className="product-image"
              />

              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <div className="product-price-qty">
                  <p className="product-price">${product.price}</p>
                  <span>Qty: {product.stockQuantity}</span>
                </div>
                <p className="product-desc">{product.description}</p>

                <div className="product-meta">
                  <span>Category {product.category.name}</span>
                  <span>Brand {product.brand.name}</span>
                </div>

                <button className="btn-primary">Add to List</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="center" style={{ marginBottom: "5rem"}}>
        <h1>List Order</h1>
      </div>

      <div className="left" style={{display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: "5rem"}}>
        <span>
          <div className="header-pay">
            <div>
              <span>Subtotal</span>
              <strong>subtotal</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>tex</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>total</strong>
            </div>
          </div>
          <div className="payment-me">
            <div className="cash-box">
              <label>Cash Received</label>
              <input type="number" placeholder="0.00" />
            </div>
            <div className="payment-methods">
              <button>
                <span>💵</span> Cash
              </button>
              <button>
                <span>📱</span> QR Pay
              </button>
            </div>
          </div>
        </span>
        <div className="nav-pay">
          <div className="customer-box">
            <div>
              <span>Customer</span>
              <strong>Walk-in Customer</strong>
            </div>
            <button>✏️</button>
          </div>

          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default SalePos;
