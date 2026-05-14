import React, { useCallback, useEffect, useMemo, useState } from "react";
import useStore from "../CustomHooks/HookS";
import "./Shop.css";
import { Search } from "lucide-react";
import request from "../../../utils/request";
import { BaseURL } from "../../../utils/BaseURL";
import { useNavigate } from "react-router-dom";
import { alertError } from "../../../swertalert/AlertSuccess";

const Shop = () => {
  const { cate } = useStore();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [Categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("Popularity");
  const [loadPro, setLoadPro] = useState(6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loadMore, setLoadMore] = useState(false);
  const navigate = useNavigate();

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await request(
        `/api/product/limit?limit=${loadPro}`,
        "GET",
      );

      if (response && Array.isArray(response.products)) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      alertError({text: err?.message || "Failed to fetch category"});
      setError("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [loadPro]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // =========================
  // FILTER + SORT PRODUCTS
  // =========================
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let data = [...products];

    // SEARCH
    if (search.trim()) {
      data = data.filter(
        (product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase()) ||
          product?.category?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          product?.brand?.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // CATEGORY
    if (category !== "All") {
      data = data.filter((product) => product?.category?.name === category);
    }

    // PRICE FILTER
    if (priceRange === "Under $15") {
      data = data.filter((product) => Number(product.price) < 15);
    }

    if (priceRange === "$15 to $20") {
      data = data.filter(
        (product) => Number(product.price) >= 15 && Number(product.price) <= 20,
      );
    }

    if (priceRange === "Above $20") {
      data = data.filter((product) => Number(product.price) > 20);
    }

    // SORTING
    if (sortBy === "Price") {
      data = [...data].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "Rating") {
      data = [...data].sort(
        (a, b) => Number(b.rating || 5) - Number(a.rating || 5),
      );
    }

    if (sortBy === "Popularity") {
      data = [...data].sort(
        (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0),
      );
    }

    return data;
  }, [products, search, category, priceRange, sortBy]);

  // =========================
  // Fetch CATEGORY LIST
  // =========================
  const categoriesList = async () => {
    try{
      const res = await request("/api/category", "get");
      if(res) {
        setCategories(res.categories || []);
      }
    }catch(error) {
      alertError({text: error?.message || "Failed to fetch category"});
    }
  };
  useEffect(() => {
    categoriesList();
  }, [Categories]);
  // const categories = useMemo(() => {
  //   if (!Array.isArray(products)) return ["All"];

  //   return [
  //     "All",
  //     ...new Set(products.map((item) => item?.category?.name).filter(Boolean)),
  //   ];
  // }, [products]);

  useEffect(() => {
    if(cate){
      setCategory(cate);
    }
  }, [cate]);
  // =========================
  // RESET FILTERS
  // =========================
  const resetFilter = () => {
    setSearch("");
    setCategory("All");
    setPriceRange("All Prices");
    setSortBy("Popularity");
  };

  // =========================
  // VIEW DETAIL
  // =========================
  const handleViewDetail = (id) => navigate(`/index/viewdetail/${id}`);

  // =========================
  // LOAD MORE
  // =========================
  const handleLoadMore = () => {
    setLoadMore(true);
    setTimeout(() => {
      setLoadMore(false);
      setLoadPro((prev) => prev + 6);
    }, 2500);
  };

  return (
    <>
      {/* =========================
          HERO SECTION
      ========================= */}
      <div className="shop-container">
        <div className="shop-hero">
          <div className="shop-content">
            <span className="shop-label">SHOP</span>

            <h1 className="shop-title">
              Discover polished coffee picks for every kind of brew
            </h1>

            <p className="shop-subtitle">
              Search in real time, sort by taste or value, and build your cart
              with ease.
            </p>
          </div>

          {/* SEARCH */}
          <div className="shop-search-wrapper">
            <div className="shop-search">
              <Search size={18} className="search-icon" />

              <input
                type="text"
                placeholder="Search by name, category, origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="shop-circle"></div>
        </div>
      </div>

      {/* =========================
          PRODUCTS SECTION
      ========================= */}
      <div className="shop-products">
        {/* FILTER SIDEBAR */}
        <aside className="filter-box">
          <div className="filter-top">
            <span>REFINE</span>

            <button onClick={resetFilter}>Reset</button>
          </div>

          <h2>Filter Coffee</h2>

          {/* CATEGORY */}
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            {Categories?.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          {/* PRICE */}
          <label>Price range</label>

          <div className="price-buttons">
            {["All Prices", "Under $15", "$15 to $20", "Above $20"].map(
              (item) => (
                <button
                  key={item}
                  className={priceRange === item ? "active" : ""}
                  onClick={() => setPriceRange(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </aside>

        {/* PRODUCT AREA */}
        <main className="product-area">
          {/* HEADER */}
          <div className="product-header">
            <div>
              <h3>{filteredProducts.length} matching products</h3>

              <p>Filters update instantly as you type, sort, or refine.</p>
            </div>

            {/* SORT */}
            <div className="sort-box">
              <label>Sort by</label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Popularity">Popularity</option>

                <option value="Price">Price</option>

                <option value="Rating">Rating</option>
              </select>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="loading-products">Loading products...</div>
          )}

          {/* ERROR */}
          {error && <div className="error-products">{error}</div>}

          {/* PRODUCTS */}
          {/* PRODUCTS */}
          <div className="product-grid">
            {loading ? (
              // =========================
              // INITIAL LOADING
              // =========================
              <div className="loading-products-wrapper">
                <div className="loading-products"></div>

                <p className="loading-products-text">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                {filteredProducts.map((product) => (
                  <div className="coffee-card" key={product.id}>
                    {/* IMAGE */}
                    <div
                      className="coffee-img"
                      onClick={() => handleViewDetail(product.id)}
                    >
                      <span>{product?.category?.name}</span>

                      <img src={BaseURL + product.image} alt={product?.name} />
                    </div>

                    {/* INFO */}
                    <div className="coffee-info">
                      <div className="coffee-price-row">
                        <small>{product?.brand?.name}</small>

                        <strong>${product?.price}</strong>
                      </div>

                      <h3>{product?.name}</h3>

                      <p>{product?.description}</p>

                      <div className="rating">
                        ★★★★★ <b>{product?.rating || "5.0"}</b>
                      </div>

                      <div className="popularity">
                        {product?.popularity || 99}% popularity
                      </div>

                      <button
                        className="details-btn"
                        onClick={() => handleViewDetail(product.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}

                {/* LOAD MORE */}
                <div className="load-more">
                  {loadMore ? (
                    <div className="loading-products-wrapper">
                      <div className="loading-products"></div>

                      <p className="loading-products-text">
                        Loading more products...
                      </p>
                    </div>
                  ) : (
                    <button onClick={handleLoadMore}>Load More</button>
                  )}
                </div>
              </>
            ) : (
              // =========================
              // EMPTY STATE
              // =========================
              <div className="loading-container">
                <div className="loading-products-wrapper">
                  <div className="loading-products"></div>

                  <p className="loading-products-text">
                    Loading more products...
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Shop;
