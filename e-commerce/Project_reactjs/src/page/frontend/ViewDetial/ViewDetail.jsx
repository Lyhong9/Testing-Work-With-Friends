import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import require from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import "./ViewDtial.css";
import useStore from "../CustomHooks/HookS";
import { BaseURL } from "../../../utils/BaseURL";
import {SetProductLocal, GetProductLocal} from "../../../store/LocalStorage";
import { Alert } from 'antd';
import Navbar from "../Navbar/Navbar";
import AlertOrder from "../../../swertalert/AlertOrder";
const ViewDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [alertSuccess, setAlertSuccess] = useState(false);

  // set cate back to shop 
  const { cate, setCate } = useStore();

  // set price 
  const [Price, setPrice] = useState(0);

  // set Medium 
  const [MediumPrice, setMediumPrice] = useState(0);

  // set  true false Size bettle  
  const [bettleSize, setBettleSize] = useState(
    {
      small: false,
      medium: true,
      large: false
    }
  )

  // usestate size  cafe 
  const [chooseSiz, setChooseSiz] = useState("Medium");

  // usestate qty sugar  
  const [qtySugar, setQtySugar] = useState(50);

  // useState sugar 
  const [sugar, setSugar] = useState(
    {
      handle0: false,
      handle25: false,
      handle50: true,
      handle75: false,
      handle100: false
    }
  )

  // fetch data products 
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
  }, [id, alertSuccess]);


  // back to  shop 
  const handleBack = (cate) => {
    setCate(cate);
    navigate("/index/shop");
  };

  // back to shop with id category
  const handleBackByCate = (cate) => {
    setCate(cate);
    navigate("/index/shop");
  };

  // size small  
  const handleSmall = () => {
    setBettleSize({
      small: true,
      medium: false,
      large: false
    })
    setPrice(1.50);
    setChooseSiz("Small");
    setMediumPrice(0)
  }

  // size medium   
  const handleMedium = () => {
    setBettleSize({
      small: false,
      medium: true,
      large: false
    })
    setChooseSiz("Medium")
    setMediumPrice(products.price)
  }

  // size large 
  const handleLarge = () => {
    setBettleSize({
      small: false,
      medium: false,
      large: true
    })
    setChooseSiz("Large")
    setPrice(-2.50);
    setMediumPrice(0)
  }

  // sugar 0 
  const handle0 = () => {
    setSugar({
      handle0: true,
      handle25: false,
      handle50: false,
      handle75: false,
      handle100: false
    })

    setQtySugar(0);
  }

  // sugar 25
  const handle25 = () => {
    setSugar({
      handle0: false,
      handle25: true,
      handle50: false,
      handle75: false,
      handle100: false
    })
    setQtySugar(25);
  }

  // sugar 50
  const handle50 = () => {
    setSugar({
      handle0: false,
      handle25: false,
      handle50: true,
      handle75: false,
      handle100: false
    })
    setQtySugar(50);
  }

  // sugar 75 
  const handle75 = () => {
    setSugar({
      handle0: false,
      handle25: false,
      handle50: false,
      handle75: true,
      handle100: false
    })

    setQtySugar(75);
  }

  // sugar 100 
  const handle100 = () => {
    setSugar({
      handle0: false,
      handle25: false,
      handle50: false,
      handle75: false,
      handle100: true
    })

    setQtySugar(100);
  }
  
  // totalPrice order 
  let  totalPrice = MediumPrice ? products?.price : products?.price - Price

  // create object
  const obj  =  [
    {
      ...products,
      totalPrice :totalPrice,
      chooseSiz:chooseSiz,
      sugar:qtySugar
    }
  ]
  const handleAddToCart = () => {
    setAlertSuccess(true);
    SetProductLocal(obj);
    setCate(count => count + 1);
    setInterval(() => {
      setAlertSuccess(false);
    }, 4500);
  };


  return (
    <div className="detail-page">
      {loading ? (
        <div>Loading...</div>
      ) : !products ? (
        <div>Product not found.</div>
      ) : (
        <div>
          {alertSuccess ? (
               <div>
                 <AlertOrder />  
               </div>
          ) : (
            ""
          )}
          <div className="d-flex gap-2 header-list ">
            <span onClick={() => handleBack(products?.category?.name)} className="back-to-shop">
              <i className="bi bi-arrow-bar-left">Back to shop</i>
            </span>
            <span className="space">/</span>
            <span
              onClick={() => handleBackByCate(products?.category?.name)}
              className="back-cate"
            >
              {products?.category?.name}
            </span>
            <span className="space">/</span>
            <span className="product-name">{products?.name}</span>
          </div>
          <div className="detail-shell ">
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

                <div className="pill">
                  {chooseSiz} / {qtySugar}% sugar
                </div>

                <p>Size</p>
                <div className="choice-grid">
                  <button
                    onClick={handleSmall}
                    className={bettleSize.small ? "active" : ""}
                  >
                    Small
                    <br />
                    <small>-$1.50</small>
                  </button>
                  <button
                    className={bettleSize.medium ? "active" : ""}
                    onClick={handleMedium}
                  >
                    Medium
                    <br />
                    <small>Base price</small>
                  </button>
                  <button
                    onClick={handleLarge}
                    className={bettleSize.large ? "active" : ""}
                  >
                    Large
                    <br />
                    <small>+$2.50</small>
                  </button>
                </div>

                <p>Sugar level</p>
                <div className="sugar-grid">
                  <button
                    onClick={handle0}
                    className={sugar.handle0 ? "active" : ""}
                  >
                    0%
                  </button>
                  <button
                    onClick={handle25}
                    className={sugar.handle25 ? "active" : ""}
                  >
                    25%
                  </button>
                  <button
                    onClick={handle50}
                    className={sugar.handle50 ? "active" : ""}
                  >
                    50%
                  </button>
                  <button
                    onClick={handle75}
                    className={sugar.handle75 ? "active" : ""}
                  >
                    75%
                  </button>
                  <button
                    onClick={handle100}
                    className={sugar.handle100 ? "active" : ""}
                  >
                    100%
                  </button>
                </div>
              </div>

              <div className="price-row">
                <div>
                  <span>SELECTED CUP</span>
                  <h2>${totalPrice}</h2>
                  <p>{chooseSiz} size with {qtySugar}% sugar</p>
                </div>

                <button className="cart-btn" onClick={handleAddToCart}>
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
