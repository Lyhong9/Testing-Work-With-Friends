import React from "react";
import "./BodyHome.css";
import require from "../../../utils/request";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";

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
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProduct = filteredProduct.slice(startIndex, endIndex);
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await require("/api/product", "GET");
      // console.log(res);
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

  useEffect(() => {
    if(searchKeyword) {
      setFilteredProduct(
        product.filter((item) =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      );
    }
    else {
      setFilteredProduct(product);
    }
  }, [product, searchKeyword]);

  const handleViewDetail = (productId) => {
    navigate(`viewdetail/${productId}`);
  };
  return (
    <>
    {/* header slide  */}
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
          <button onClick={() => navigate("viewallproduct")}>Browse all products</button>
        </div>
      </section>
      {/* end header slide  */}
      
      {/* body product slice  */}
      <div className="brand-container">
        {/* page page display filter  */}
        <div className="d-flex justify-content-between align-items-center container" style={{"max-width": "1100px"}}>
          <div className="items-per-page">
            <label>Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>product per page</span>
          </div>

          <div className="search-box">
            <label>Search product:</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        <section className="body-product">
          {paginatedProduct.map((item) => (
            <div className="product-box" key={item.id} onClick={()=>handleViewDetail(item.id)}>
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

                <button className="details-btn cart-btn " onClick={() => handleViewDetail(item.id)}>View Details</button>
                {/* <button className="cart-btn">Add to Cart</button> */}
              </div>
            </div>
          ))}
        </section>
      </div>
      {/* body product slice  */}

      {/* card category  */}
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
      {/* end card category  */}

      {/* body offer last  */}
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
      {/* end body offer last  */}
    </>
  );
};

export default BodyHomepage;
