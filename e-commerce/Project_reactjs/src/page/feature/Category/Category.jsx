
import { useState, useEffect } from "react";
import request from "../../../utils/request";
import { alertError, alertSuccess, confirmDelete } from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import "../../../style/feature.css";
import "./category.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
const Category = () => {  
  const MAX_PHOTO_SIZE_MB = 2;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
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

  // Pagination calculation
  const totalPages = Math.ceil(filteredCategory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategory = filteredCategory.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if(searchKeyword.trim()) {
      const filtered =  Category.filter(
        (cate) => (cate.name && cate.name.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFilteredCategory(filtered);
    }
    else {
      setFilteredCategory(Category);
    }
  }, [searchKeyword, Category]);

  const fetchCategory = () => {};
  const handleFormSubmit = () => {};
  const handleAddCategory = () => {};

  const handleEditcategory = (product) => {};

  const handleDeletecategory = (id) => {};

  // const handlePhotoChange = (event) => {
  //   const file =  event.target.files?.[0];
  //   if(!file){
  //     return;
  //   }
  //   if(file.size > MAX_PHOTO_SIZE_BYTES){
  //     alertError("Error", `Image too large. Please choose a file smaller than ${MAX_PHOTO_SIZE_MB}MB.`);
  //     event.target.value = "";
  //     return;
  //   }
  //   setSelectedPhotoFile(file);

  //   const reader = new FileReader();
  //   reader.onloadend().then(() => {
  //     setFormData((prev) => ({...prev, image: reader.result || ""}))
  //   })

  //   reader.readAsDataURL(file);
  // };



  return (
    <>
      <div className="category-container">
        <div className="category-header">
          <h1 className="product-title">CategoryfetchCategory Management</h1>
          <button className="btn-add-product" onClick={handleAddCategory}>
            + Add New Category
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
            <span>CategoryfetchCategory per page</span>
          </div>

          <div className="search-box">
            <label>Search CategoryfetchCategory:</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategory.length > 0 ? (
                  paginatedCategory.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name || "-"}</td>
                      <td>{product.description || "-"}</td>
                      <td>{product.status || "-"}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditcategory(product)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeletecategory(product.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No Category found
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
          {Math.min(endIndex, filteredCategory.length)} of{" "}
          {filteredCategory.length} Category
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

                {/* select status (optional) */}
                <div className="form-group">
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
                </div>

                {/* image  */}
                {/* <div className="form-group">
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
                </div> */}
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

export default Category;
