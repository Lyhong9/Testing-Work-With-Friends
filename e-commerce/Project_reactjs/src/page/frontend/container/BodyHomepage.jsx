import React from "react";
import "./BodyHome.css";
import require from "../../../utils/request";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {alertError} from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
const products = [
  {
    tag: "Best Seller",
    origin: "Colombia",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800",
    type: "ESPRESSO",
    name: "Midnight Espresso Blend",
    price: "$18.50",
    desc: "Dark cocoa notes, silky crema, and a deep caramel finish.",
    rating: "4.9",
    pop: "98% popularity",
  },
  {
    tag: "Cafe Favorite",
    origin: "Signature House",
    img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800",
    type: "LATTE",
    name: "Velvet Vanilla Latte",
    price: "$14.75",
    desc: "Creamy microfoam with natural vanilla sweetness and warm spice.",
    rating: "4.7",
    pop: "92% popularity",
  },
  {
    tag: "Single Origin",
    origin: "Ethiopia",
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800",
    type: "BEANS",
    name: "Highland Whole Beans",
    price: "$22.00",
    desc: "Bright berry aroma with floral finish for pour-over and French press.",
    rating: "4.8",
    pop: "95% popularity",
  },
  {
    tag: "Smooth",
    origin: "Costa Rica",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
    type: "LATTE",
    name: "Sunrise Honey Latte",
    price: "$15.50",
    desc: "Golden honey, citrus lift, and a creamy finish built for slow mornings.",
    rating: "4.8",
    pop: "90% popularity",
  },
];

const categories = [
  {
    label: "BOLD AND GLOSSY",
    title: "Espresso",
    desc: "Bold blends with velvet crema and rich chocolate depth.",
    icon: "☕",
  },
  {
    label: "SOFT AND LAYERED",
    title: "Latte",
    desc: "Creamy, cafe-inspired drinks softened with layered sweetness.",
    icon: "♨",
  },
  {
    label: "ORIGIN FIRST",
    title: "Beans",
    desc: "Whole-bean options for pour-over, espresso, and French press.",
    icon: "☘",
  },
];

const BodyHomepage = () => {
  
const [product, setProduct] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await require("/api/product", "GET");
      console.log(res);
      if (res) {
        setProduct(res.product);
      }
    } catch (error) {
      alertError({ text: error?.message || "fetch products Failed!" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <section className="body-homepage">
        <div className="body-homepage-left">
          <span>FEATURED PICKS</span>
          <h1>Most-loved coffees from our curated lineup</h1>
          <p>
            Small-batch roasts, silky lattes, and beautifully merchandised
            staples for your everyday coffee bar.
          </p>
        </div>

        <div className="body-homepage-right">
          <span>CURATED LINE-UP</span>
          <p>
            Designed to feel premium on desktop, quick on mobile, and easy to
            shop at a glance.
          </p>
          <button>Browse all products</button>
        </div>
      </section>

      <section className="body-product">
        {product.map((item, index) => (
          <div className="product-box" key={index}>
            <div className="product-img">
              <img src={BaseURL + item.image} alt={item.name} />
              <div className="badge left text-dark">{item.stockQuantity}</div>
              <div className="badge right">{item.brand.name}</div>
            </div>

            <div className="product-info">
              <div className="product-top">
                <span>{item.category.name}</span>
                <strong>{item.price}</strong>
              </div>

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="rating">
                ★★★★★ <span></span>
              </div>
              {/* <div className="popularity">{item.pop}</div> */}

              <button className="details-btn">View Details</button>
              <button className="cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </section>

      <section className="body-card">
        <span>CATEGORIES</span>
        <h2>Find your perfect coffee mood</h2>
        <p>Jump into the flavor profile that matches your routine.</p>

        <div className="category-grid">
          {categories.map((cat, index) => (
            <div className={`category-card card-${index + 1}`} key={index}>
              <div className="category-head">
                <span>{cat.label}</span>
                <div>{cat.icon}</div>
              </div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <button>Explore {cat.title}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="body-box">
        <div className="offer-left">
          <span>SEASONAL OFFER</span>
          <h2>
            Build a first-order bundle that feels as styled as a cafe counter.
          </h2>
          <p>
            Pair our Roaster’s Reserve Beans with a signature latte mix, tasting
            notes, and a polished mobile-first shopping flow.
          </p>

          <div className="offer-tags">
            <span>Roaster’s Reserve</span>
            <span>Vanilla Latte Mix</span>
            <span>Free tasting guide</span>
          </div>
        </div>

        <div className="offer-card">
          <span>LAUNCH PERK</span>
          <h3>20% Off</h3>
          <p>
            Use code <b>FIRSTBREW</b> on your first curated bundle.
          </p>
          <button>Claim the offer</button>
        </div>
      </section>
    </>
  );
};

export default BodyHomepage;