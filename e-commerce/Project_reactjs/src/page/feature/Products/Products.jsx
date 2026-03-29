import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./product.css";
import request from "../../../utils/request";
import {
  alertSuccess,
  confirmDelete,
  alertError,
} from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
const Products = () => {
  const MAX_PHOTO_SIZE_MB = 2;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    qty: "",
    category: "",
    brand: "",
    status: "",
    image: "",
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  const { brand, category } = GlobleData();

  // Pagination calculation
  const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProduct = filteredProduct.slice(startIndex, endIndex);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await request("/api/product", "GET");

      if (response && response.product) {
        setProducts(response.product);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CloseModal();
  }, [showForm]);
  const CloseModal = () => {
    if (showForm == false) {
      setFormData({
        name: "",
        desc: "",
        price: "",
        qty: "",
        category: "",
        brand: "",
        status: "",
        image: "",
      });
      setSelectedPhotoFile(null);
      setEditingCode(null);
      setShowForm(false);
    }
  };

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredProduct(filtered);
    } else {
      setFilteredProduct(products);
    }
    setCurrentPage(1);
  }, [searchKeyword, products]);
  const handleAdd = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.desc);
      payload.append("price", formData.price);
      payload.append("stockQuantity", formData.qty);
      payload.append("categoryId", formData.category);
      payload.append("brandId", formData.brand);
      // payload.append("status", formData.status ? 1 : 0);

      if (selectedPhotoFile) {
        payload.append("image", selectedPhotoFile);
      }

      let url = "/api/product";
      let method = "POST";

      if (editingCode) {
        payload.append("id", editingCode);
        method = "PUT"; // or POST if backend requires
      }

      const response = await request(url, method, payload);

      if (response) {
        alertSuccess({
          title: "Success!",
          text: editingCode
            ? "products updated successfully"
            : "products created successfully",
        });
        setShowForm(false);
        fetchProduct();
      } else {
        alertError("Error", response.message);
      }
    } catch (error) {
      alertError("Error", "Something went wrong!");
    }
  };

  const handleDeleteBrand = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/product/${id}`, "DELETE");
      fetchProduct();
      setLoading(false);
    });
  };

  const handleEditBrand = (product) => {
    setFormData({
      name: product.name || "",
      desc: product.description || "",
      price: product.price || "",
      qty: product.stockQuantity || "",
      category: product.categoryId || "",
      brand: product.brandId || "",
      // status: product.status ?? "", // ✅ FIXED
      image: product.image || "",
    });

    setSelectedPhotoFile(product.image || null);
    setEditingCode(product.id);
    setShowForm(true);
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      alertError(
        "Error",
        `Image too large. Please choose a file smaller than ${MAX_PHOTO_SIZE_MB}MB.`,
      );
      event.target.value = "";
      return;
    }
    setSelectedPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const getPhotoUrl = (photo) => {
    return `${BaseURL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };
  return (
    <>
      <div className="product-container">
        {/* search and ad new  */}
        <div className="product-header">
          <h1 className="product-title">Brand Management</h1>
          <button className="btn-add-product" onClick={handleAdd}>
            + Add New Brand
          </button>
        </div>

        <div className="product-controls">
          <div className="items-per-page">
            <label>Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>products per page</span>
          </div>

          <div className="search-box">
            <label>Search products:</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        {/* end search and ad new  */}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Brand</th>
                  <th>Category</th>
                  {/* <th>Status</th> */}
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProduct.length > 0 ? (
                  paginatedProduct.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name || "-"}</td>
                      <td>{product.description || "-"}</td>
                      <td>{product.price || "-"}</td>
                      <td>{product.stockQuantity || "-"}</td>
                      <td>{product.brand?.name || "-"}</td>
                      <td>{product.category?.name || "-"}</td>
                      {/* <td>{product.status ? "Active" : "Inactive"}</td> */}
                      <td>
                        {product.image ? (
                          <img
                            src={BaseURL + product.image}
                            className="product-photo"
                          />
                        ) : (
                          // <img src={"https://clubcode-api-pos.up.railway.app/" + product.photo}  className="product-photo" />
                          "-"
                        )}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditBrand(product)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteBrand(product.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* filter page current table  */}
        <div className="pagination-info">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredProduct.length)} of{" "}
          {filteredProduct.length} products
        </div>

        <div className="pagination-controls">
          <button
            className="btn-pagination"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="btn-pagination"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        {/*end filter page current table  */}

        {/* Modal alert add  */}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCode ? "Edit Brand" : "Add New Brand"}</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                {/* name product  */}
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    // disabled={!!editingCode}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                {/* description  */}
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    placeholder="Enter description"
                  />
                </div>

                {/* price product  */}
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Enter price"
                  />
                </div>

                {/* stock quantity product  */}
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                    placeholder="Enter stock quantity"
                  />
                </div>

                {/* select category (optional) */}
                <div className="form-group">
                  <Box>
                    <FormControl fullWidth size="small">
                      <InputLabel id="product-select-label">category</InputLabel>
                      <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={formData.category}
                        label="category"
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <MenuItem value="">
                          <em>-- Select category --</em>
                        </MenuItem>
                       {
                        category.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))
                       }
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                {/* select brand (optional) */}
                <div className="form-group">
                  <Box>
                    <FormControl fullWidth size="small">
                      <InputLabel id="product-select-label">brand</InputLabel>
                      <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={formData.brand}
                        label="brand"
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                      >
                        <MenuItem value="">
                          <em>-- Select brand --</em>
                        </MenuItem>
                       {
                        brand.map((brand) => (
                          <MenuItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </MenuItem>
                        ))
                       }
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                {/* select status (optional) */}
                {/* <div className="form-group">
                  <Box>
                    <FormControl fullWidth size="small">
                      <InputLabel id="product-select-label">status</InputLabel>
                      <Select
                        labelId="product-select-label"
                        id="product-select"
                        value={formData.status}
                        label="status"
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <MenuItem value="">
                          <em>-- Select status --</em>
                        </MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={0}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </div> */}

                {/* image  */}
                <div className="form-group">
                  <label>image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Brand preview"
                      className="product-photo-preview"
                    />
                  ) : null}
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    {editingCode ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/*end Modal alert add  */}
      </div>
    </>
  );
};

export default Products;
