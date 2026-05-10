import React, {useState, useEffect } from "react";
import "./ShopCartOnly.css";
import {
  GetProductLocal,
  ClearProductLocal,
  RemoveProduct,
} from "../../../store/LocalStorage";
import { BaseURL } from "../../../utils/BaseURL";
import { useNavigate } from "react-router-dom";
import useStore from "../CustomHooks/HookS";

const ShopCartOnly = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState(GetProductLocal());

  const { cate, setCate } = useStore();

  useEffect(() => {
    const updateProduct = () => setProduct(GetProductLocal());
    updateProduct();
    window.addEventListener('storage', updateProduct);
    return () => window.removeEventListener('storage', updateProduct);
  }, []);

  const clearCart = () => {
    ClearProductLocal();
    setProduct([]);
    setCate((count) => count + 1);
  };

  const removeProduct = (id) => {
    if (id == null) return;
    const updatedProduct = RemoveProduct(id);
    setProduct(updatedProduct);
    setCate((count) => count + 1);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    const updatedProducts = product.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("productLocal", JSON.stringify(updatedProducts));
    setProduct(updatedProducts);
  }


  return (
    <>
      {product?.length > 0 ? (
        <div className="shop-cart-page">
          <div className="shop-cart-container">
            <p className="cart-label">Cart</p>

            <h1 className="cart-title">
              Your coffee cart
            </h1>

            <p className="cart-description">
              Review your selected products,
              adjust quantities, and see the
              frontend-only totals update instantly.
            </p>

            <div className="cart-top-row">
              <h2 className="cart-count">
                {product.length} items in your cart
              </h2>

              <button
                className="clear-btn"
                onClick={clearCart}
              >
                Clear cart
              </button>
            </div>

            <div className="cart-layout">
              <div className="cart-card">
                {product.map((item, index) => {
                  const itemPrice = Number(
                    item.totalPrice || 0
                  );

                  const itemQuantity = item.quantity || 1;

                  const itemTotal =
                    itemPrice * itemQuantity;

                  return (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <img
                        src={BaseURL + item.image}
                        alt={item.name}
                        className="product-image"
                      />

                      <div className="product-info">
                        <p className="product-category">
                          {item.category?.name ||
                            "Coffee"}
                        </p>

                        <h3 className="product-title">
                          {item.name}
                        </h3>

                        <div className="product-badge">
                          {item?.chooseSiz} ·{" "}
                          {item?.sugar ||
                            "50% sugar"}
                        </div>

                        <p className="product-description">
                          {item.description ||
                            "Bright berry aroma with floral finish for pour-over and French press."}
                        </p>
                      </div>

                      <div className="product-meta">
                        <p className="meta-label">
                          Price
                        </p>

                        <p className="meta-value">
                          $
                          {itemPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="product-meta">
                        <p className="meta-label">
                          Quantity
                        </p>

                        <div className="quantity-box">
                          <button
                            onClick={() => updateQuantity(item.id, itemQuantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>

                          <span className="qty-value">
                            {itemQuantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, itemQuantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="product-total">
                        <p className="meta-label">
                          Total
                        </p>

                        <p className="total-price">
                          $
                          {itemTotal.toFixed(2)}
                        </p>

                        <button
                          className="remove-btn"
                          onClick={() => removeProduct(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-card">
                <h2 className="summary-title">
                  Order Summary
                </h2>

                <div className="summary-content">
                  <div className="summary-row">
                    <span className="soft-text">
                      Subtotal
                    </span>

                    <span className="summary-value">
                      ${product.reduce((sum, item) => sum + (Number(item.totalPrice || 0) * (item.quantity || 1)), 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="soft-text">
                      Estimated tax
                    </span>

                    <span className="summary-value">
                      ${(product.reduce((sum, item) => sum + (Number(item.totalPrice || 0) * (item.quantity || 1)), 0) * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="soft-text">
                      Shipping
                    </span>

                    <span className="summary-value">
                      Free
                    </span>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>

                    <span>
                      ${(product.reduce((sum, item) => sum + (Number(item.totalPrice || 0) * (item.quantity || 1)), 0) * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="summary-actions">
                  <button className="checkout-btn">
                    Proceed to Checkout
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      navigate("/index/shop")
                    }
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart mt-3">
          <div className="empty-cart-icon">
            ☕
          </div>

          <h2 className="empty-cart-title">
            Your cart is empty
          </h2>

          <p className="empty-cart-description">
            Looks like you haven’t added any
            coffee yet. Start exploring our
            premium blends and discover your
            perfect cup.
          </p>

          <button
            className="empty-cart-btn"
            onClick={() =>
              navigate("/index/shop")
            }
          >
            Continue Shopping
          </button>
        </div>
      )}
    </>
  );
};

export default ShopCartOnly;