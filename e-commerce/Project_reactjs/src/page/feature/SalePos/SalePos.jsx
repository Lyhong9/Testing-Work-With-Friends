import React, { useState, useEffect } from "react";
import "./salePos.css";
import request from "../../../utils/request";
import { BaseURL } from "../../../utils/BaseURL";
import { alertError } from "../../../swertalert/AlertSuccess";
import UseSalePos from "./UseSalePos";
import {Modal} from "antd"

const SalePos = () => {
  const [products, setProducts] = useState([]);
  const [Search, SetSearch] = useState("");

  const {
    handleAddList,
    paymentMethod,
    Cart,
    handleQty,
    totalPrice,
    removeItem,
    clearCart,
    handlePayMethod,
    checkout,
    Qr,
    Case,
    cashReceived,
    setcashReceived,
    isOpen,setIsOpen,
    formatTime,
    countMinutes,
    caseLoading,
  } = UseSalePos();

  useEffect(() => {
    fetchProducts();
  }, []);

   useEffect(() => {
    if(Search.trim()) {
      const filtered =  products.filter(
        (pro) => (pro.name && pro.name.toLowerCase().includes(Search.toLowerCase()))
      );
      setProducts(filtered);
    }
    else {
      setProducts(products);
      fetchProducts();
    }
  }, [Search]);

  const fetchProducts = async () => {
    try {
      const res = await request("/api/product", "GET");
      if (res) {
        setProducts(res.product);
      }
    } catch (error) {
      alertError({ text: error?.message || "fetch products Failed!" });
    }
  };

  return (
    <>
      <div className="sale-container">

        {/* ✅ RIGHT: PRODUCT LIST */}
        <div className="right">
        <div className="search-bar">
          <input type="text" placeholder="search" value={Search} onChange={(e)=> SetSearch(e.target.value)}/>  
        </div>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => handleAddList(product)}
                >
                  <img
                    src={BaseURL + product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  <div className="product-info">
                    <p className="product-name">{product.name}</p>

                    <div className="product-price-qty">
                      <p className="product-price" style={{}}>
                        ${product.price}
                      </p>
                      <span>Stock: {product.stockQuantity}</span>
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
          ) : (
            <div className="empty-order">
              <div className="spinner"></div>
              <p>Loading Products...</p>
            </div>
          )}
        </div>

        {/* ✅ CENTER: CART */}
        <div className="center">
          <span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <p>Order List</p>
              <button className="" onClick={clearCart}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
            {Cart.length > 0 ? (
              Cart.map((item) => (
                <>
                  <div key={item.id} className="order-item">
                    <div className="order-info">
                      <div>
                        <img src={BaseURL + item.image} alt={item.name} />
                        <div>
                          <p className="order-name">{item.name}</p>
                          <p className="order-price">${item.price}</p>
                        </div>
                      </div>

                      {/* ✅ FIXED QTY CONTROL */}
                      <div  style={{display: "flex", alignItems: "center"}}>
                        <button
                          className="btn-secondary"
                          onClick={() => handleQty(item.id, -1)}
                        >
                          -
                        </button>

                        <span>{item.stockQuantity}</span>

                        <button
                          className="btn-secondary"
                          onClick={() => handleQty(item.id, 1)}
                        >
                          +
                        </button>
                        <span
                          className="order-delete"
                          onClick={() => removeItem(item.id)}
                        >
                          <button>
                            <i className="bi bi-x-lg"></i>{" "}
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="order-qty">
                      <span>Total: ${item.price * item.stockQuantity}</span>
                    </div>
                  </div>
                </>
              ))
            ) : (
              <div className="empty-order">
                <div className="spinner"></div>
                <p>Loading Cart...</p>
              </div>
            )}
          </span>
        </div>

        {/* ✅ LEFT: PAYMENT */}
        <div className="left">
          <div className="header-pay">
            <div>
              <span>Subtotal</span>
              <strong>${totalPrice}</strong>
            </div>

            <div>
              <span>Tax (10%)</span>
              <strong>${(totalPrice * 0.1).toFixed(2)}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>${(totalPrice * 1.1).toFixed(2)}</strong>
            </div>
          </div>

          <div className="payment-me">
            <div className="cash-box">
              <label>Cash Received</label>
              <input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setcashReceived(e.target.value)}
              />
            </div>

            <div className="payment-methods">
              <button onClick={() => handlePayMethod("cash")}>💵 Cash</button>
              <button onClick={() => handlePayMethod("qr")}>📱 QR Pay</button>
            </div>
          </div>

          {/* <div className="nav-pay">
            <div className="customer-box">
              <div>
                <span>Customer</span>
                <strong>Walk-in Customer</strong>
              </div>
              <button>✏️</button>
            </div>

            <button className="checkout-btn">Checkout</button>
          </div> */}
          <div className="customer-box">
            <div>
              <span>Customer</span>
              <strong>Walk-in Customer</strong>
            </div>
            <button>✏️</button>
          </div>

          <button className="checkout-btn" onClick={checkout}>
            Checkout — {(totalPrice * 1.1).toFixed(2)}
          </button>
        </div>
      </div>
      <div className="payment-processing">
        {paymentMethod === "qr" && (
          <Modal
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
            title="Payment Processing"
          >
            <div className="qr-code-container">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment:${totalPrice.toFixed(
                  2
                )}`}
                alt="QR Code"
                className="qr-code-image"
              />
            </div>
            <div style={{ textAlign: "center", fontSize: "15px", color: 'rgb(255, 0, 0', fontWeight: '600'}}>{formatTime(countMinutes)}</div>
            <h2 style={{ textAlign: "center" }}>Scan to Pay</h2>

            <div className="processing-details">
              <div className="detail-row">
                <span>Amount</span>
                <strong>{totalPrice.toFixed(2)}</strong>
              </div>

              <div className="detail-row">
                <span>Status</span>
                <strong>
                  <span className="pulse-dot"></span>
                  Waiting for payment...
                </strong>
              </div>
            </div>
          </Modal>
        )}
        <div>
          {
            caseLoading ? (
              <div className="empty-order">
                <div className="spinner"></div>
                <p>Loading Cart...</p>
              </div>
            ) : (
              ""
            )
          }
        </div>
      </div>
    </>
  );
};

export default SalePos;
