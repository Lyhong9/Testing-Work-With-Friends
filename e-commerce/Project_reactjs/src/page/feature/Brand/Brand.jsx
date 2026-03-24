import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./brand.css";
const Brand = () => {
  const MAX_PHOTO_SIZE_MB = 2;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    desc: "",
    remark: "",
    brand_id: "",
    photo: "",
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);

  const handleAddBrand = () => {
    setShowForm(true);
  };


  const handleFormSubmit = async () =>{

  }

  const handlePhotoChange = async () =>{

  }

  const getPhotoUrl = async () =>{

  }
  return (
    <>
      <div className="brand-container">
        {/* search and ad new  */}
        <div className="brand-header">
          <h1 className="brand-title">Brand Management</h1>
          <button className="btn-add-brand" onClick={handleAddBrand}>
            + Add New Brand
          </button>
        </div>

        <div className="brand-controls">
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
            <span>brands per page</span>
          </div>

          <div className="search-box">
            <label>Search brands:</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        {/* end search and ad new  */}

        {paginatedBrands?.map((brand) => (
          <div className="brand-item" key={brand.brand_id}>
            <div className="brand-code">{brand.brand_id}</div>
            <div className="brand-desc">{brand.name_brand}</div>
            <div className="brand-remark">{brand.remark}</div>
          </div>
        ))}

        {/* filter page current table  */}
        <div className="pagination-info">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredBrands.length)} of {filteredBrands.length}{" "}
          brands
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
                <div className="form-group">
                  <label>Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    disabled={!!editingCode}
                    placeholder="Enter brand code"
                    required
                  />
                </div>

                {/* select category (optional) */}
                <div className="form-group">
                  <Box>
                    <FormControl fullWidth size="small">
                      <InputLabel id="category-select-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={formData.category_id}
                        label="Category"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category_id: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>-- Select Category --</em>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.code} value={cat.code}>
                            {cat.code}
                            {cat.desc ? ` - ${cat.desc}` : ""}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
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
                <div className="form-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  {formData.photo ? (
                    <img
                      src={getPhotoUrl(formData.photo)}
                      alt="Brand preview"
                      className="brand-photo-preview"
                    />
                  ) : null}
                </div>
                <div className="form-group">
                  <label>Remark</label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) =>
                      setFormData({ ...formData, remark: e.target.value })
                    }
                    placeholder="Enter remark"
                    rows="3"
                  />
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

export default Brand;
