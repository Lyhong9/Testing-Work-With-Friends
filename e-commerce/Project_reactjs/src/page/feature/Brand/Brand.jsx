import React, { use } from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./brand.css";
import request from "../../../utils/request";
import {alertSuccess, confirmDelete, alertError} from "../../../swertalert/AlertSuccess";
import {BaseURL} from "../../../utils/BaseURL";
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
    brand_id: "",
    image: "",
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);


  const fetchBrands = async () => {
    try {
       setLoading(true);
      const response = await request("/api/brand", "GET");
      console.log(response);
      // alertSuccess("Success!", "Operation completed successfully");
      // confirmDelete(async () => {
      //   await request(`product/${id}`, "DELETE");
      // })
      setLoading(false);
      setFilteredBrands(response.brand);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  useEffect(() => {
    fetchBrands();
  }, []);
  const handleAddBrand = () => {
    setShowForm(true);
  };


  const handleFormSubmit = async () =>{

    try{

      const formData = new FormData();
      formData.append("code", formData.code);
      formData.append("desc", formData.desc);
      formData.append("brand_id", formData.brand_id);
      
      if(selectedPhotoFile){
        formData.append("image", selectedPhotoFile);
      }

      const response = await request("brand", "POST", formData);

      if(response.success){
        alertSuccess("Success!", "Add Brand successfully!");
        setShowForm(false);
        fetchBrands();
      }
    }catch(error){
      alertError("Error", "Something went wrong!");
    }

  }

  const handleDeleteBrand = async (code) => {
    const result = await confirmDelete(async () => {
      await request(`brand/${code}`, "DELETE");
    });
    if (result.isConfirmed) {
      fetchBrands();
    }
  };

  const handleEditBrand = (brand) => {
    setFormData({
      code: brand.code,
      desc: brand.desc || "",
      brand_id: brand.brand_id || "",
      image: brand.image || "",
    });
    setSelectedPhotoFile(null);
    setEditingCode(brand.code);
    setShowForm(true);
  };

  const handlePhotoChange = async () =>{
    const file = event.target.files?.[0];
    if(!file){
      return;
    }
    if(file.size > MAX_PHOTO_SIZE_BYTES){
      alertError("Error", `Image too large. Please choose a file smaller than ${MAX_PHOTO_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }
    setSelectedPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  }

   const getPhotoUrl = (photo) => {
    return `${BaseURL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };
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

         {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="category-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.id}</td>
                    <td>{brand.name || "-" }</td>
                    <td>{brand.description || "-"}</td>
                    <td>{brand.status ? "Active" : "Inactive" }</td>
                    <td>
                      {brand.image ? (
                        <img src={BaseURL + brand.image}  className="brand-photo" />
                        // <img src={"https://clubcode-api-pos.up.railway.app/" + brand.photo}  className="brand-photo" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditBrand(brand)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBrand(brand.code)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-info">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredBrands.length)} of{" "}
            {filteredBrands.length} brands
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
        </>
      )}

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
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!!editingCode}
                    placeholder="Enter brand name"
                    required
                  />
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
                      className="brand-photo-preview"
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

export default Brand;
