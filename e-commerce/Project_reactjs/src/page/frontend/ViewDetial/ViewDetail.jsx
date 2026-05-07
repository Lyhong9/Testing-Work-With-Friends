import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import require from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import "./ViewDtial.css";
import useStore from "../CustomHooks/HookS";
import { BaseURL } from "../../../utils/BaseURL";
const ViewDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cate, setCate } = useStore();

  const [bettleSize, setBettleSize] = useState(
    {
      small: false,
      medium: true,
      large: false
    }
  )
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await require(`/api/product/one?search=${id}`, "GET");
        console.log(response);
        if (response && response.product) {
          setProducts(response.product);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate("/index/shop");
  };
  const handleBackByCate = (cate) => {
    setCate(cate);
    navigate("/index/shop");
  };

  const handleSmall = () => {
    setBettleSize({
      small: true,
      medium: false,
      large: false
    })
  }

  const handleMedium = () => {
    setBettleSize({
      small: false,
      medium: true,
      large: false
    })
  }
  const handleLarge = () => {
    setBettleSize({
      small: false,
      medium: false,
      large: true
    })
  }
  return (
    <div className="detail-page">
      {loading ? (
        <div>Loading...</div>
      ) : !products ? (
        <div>Product not found.</div>
      ) : (
        <div>
          <div className="d-flex gap-2 header-list container">
            <span onClick={handleBack}>
              <i className="bi bi-arrow-bar-left">Back to shop</i>
            </span>
            <span>/</span>
            <span onClick={() => handleBackByCate(products?.category?.name)}>
              {products?.category?.name}
            </span>
            <span>/</span>
            <span>{products?.name}</span>
          </div>
          <div className="detail-shell container">
            <div className="detail-image-card">
              <img src={BaseURL + products?.image} alt={products?.name} />

              <div className="popular-card">
                <small>92% customer</small>
                <b>popularity</b>
                <p>Most-saved cup in this collection right now.</p>
              </div>

              <div className="note-card">
                <span>TASTING NOTES</span>
                <div>
                  <b>Vanilla foam</b>
                  <b>Creamy body</b>
                  <b>Warm spice</b>
                </div>
                <p>Balanced sweetness with a soft cafe-style body.</p>
              </div>
            </div>

            <div className="detail-info-card">
              <span className="category-label">{products?.category?.name}</span>

              <h1>{products?.name}</h1>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>4.7</span>
              </div>

              <p className="desc">{products?.description}</p>

              <div className="features">
                <div>
                  <i className="bi bi-geo-alt"></i>
                  <b>Origin</b>
                  <span>{products?.brand?.name}</span>
                </div>
                <div>
                  <i className="bi bi-star"></i>
                  <b>Roast</b>
                  <span>Medium roast</span>
                </div>
                <div>
                  <i className="bi bi-cup-hot"></i>
                  <b>Best with</b>
                  <span>Butter brioche</span>
                </div>
              </div>

              <div className="custom-box">
                <span>CUSTOMIZE YOUR ORDER</span>
                <h3>Choose size and sugar level</h3>

                <div className="pill">Medium / 50% sugar</div>

                <p>Size</p>
                <div className="choice-grid">
                  <button onClick={handleSmall} className={bettleSize.small ? "active" : ""}>
                    Small
                    <br />
                    <small>-$1.50</small>
                  </button>
                  <button className={bettleSize.medium ? "active" : ""} onClick={handleMedium}>
                    Medium
                    <br />
                    <small>Base price</small>
                  </button>
                  <button onClick={handleLarge} className={bettleSize.large ? "active" : ""}>
                    Large
                    <br />
                    <small>+$2.50</small>
                  </button>
                </div>

                <p>Sugar level</p>
                <div className="sugar-grid">
                  <button>0%</button>
                  <button>25%</button>
                  <button className="active">50%</button>
                  <button>75%</button>
                  <button>100%</button>
                </div>
              </div>

              <div className="price-row">
                <div>
                  <span>SELECTED CUP</span>
                  <h2>${products?.price}</h2>
                  <p>Medium size with 50% sugar</p>
                </div>

                <button className="cart-btn">
                  <i className="bi bi-bag"></i> Add to Cart
                </button>
              </div>

              <div className="bottom-note">
                <p>
                  <i className="bi bi-truck"></i> Packed to stay smooth,
                  fragrant, and gift-ready.
                </p>
                <p>
                  <i className="bi bi-clock"></i> Best enjoyed for slow
                  afternoon moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default ViewDetail;
