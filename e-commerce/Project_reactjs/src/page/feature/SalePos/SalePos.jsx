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
import UseSalePos from "./UseSalePos";
import DataStore from "../../../store/DataStore";
const SalePos = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const { handleAddList, filed, setFiled, handlePlusQty, handleSubtractQty } =
    UseSalePos();

  const { data } = DataStore();

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
      <div className="right">
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-item"
              onClick={(e) => handleAddList(product)}
            >
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

      <div className="center">
        {data && data.length > 0 ? (
          <div>
            {data?.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-info" key={item.id}>
                  <p>{filed}</p>
                  <div>
                    <img src={BaseURL + item.image} alt={item.name} />
                    <div>
                      <p className="order-name">{item.name}</p>
                      <p className="order-price">${item.price}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn-secondary"
                      onClick={handleSubtractQty}
                    >
                      -
                    </button>
                    <span>{filed}</span>
                    <button className="btn-secondary" onClick={handlePlusQty}>
                      +
                    </button>
                  </div>
                </div>
                <div className="order-qty">
                  <span>Qty: {item.stockQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-order">
            <p>No products added to the order list.</p>
          </div>
        )}
      </div>

      <div
        className="left"
        // style={{display: "flex", flexDirection: "column", justifyContent: "space-between", marginBottom: "8rem" }}
      >
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
