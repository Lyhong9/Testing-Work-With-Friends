import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./brand.css";
import request from "../../../utils/request";
import {alertSuccess, confirmDelete, alertError} from "../../../swertalert/AlertSuccess";
import {BaseURL} from "../../../utils/BaseURL";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
    name: "",
    desc: "",
    status: "",
    image: "",
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
       setLoading(true);
      const response = await request("/api/brand", "GET");
      // alertSuccess("Success!", "Operation completed successfully");
      // confirmDelete(async () => {
      //   await request(`product/${id}`, "DELETE");
      // })
      if(response.success){
        setLoading(false);
        setBrands(response.brand);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }

  useEffect(() => {
    CloseModal();
  }, [showForm]);
  const CloseModal = () =>{
    if(showForm == false){
      setFormData({
          name: "",
          desc: "",
          status: "",
          image: "",
        });
        setSelectedPhotoFile(null);
        setEditingCode(null);
        setShowForm(false);
    }
  }

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredBrands(filtered);
    }
    else {
      setFilteredBrands(brands);
    }
    setCurrentPage(1);
  }, [searchKeyword, brands]);
  const handleAddBrand = () => {
    setShowForm(true);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.desc);
      payload.append("status", formData.status ? 1 : 0);

      if (selectedPhotoFile) {
        payload.append("image", selectedPhotoFile);
      }

      let url = "/api/brand";
      let method = "POST";

      if (editingCode) {
        payload.append("id", editingCode);
        method = "PUT"; // or POST if backend requires
      }

      const response = await request(url, method, payload);

      if (response) {
        alertSuccess(
         {
           title: "Success!",
          text: editingCode
            ? "Brand updated successfully"
            : "Brand created successfully",
         }
        );
        setShowForm(false);
        fetchBrands();
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
        await request(`/api/brand/${id}`, "DELETE");
        fetchBrands();
        setLoading(false);
      });
    };

  const handleEditBrand = (brand) => {
    setFormData({
      name: brand.name || "",
      desc: brand.description || "",
      status: brand.status ?? "",   // ✅ FIXED
      image: brand.image || "",
    });

    setSelectedPhotoFile(brand.image || null);
    setEditingCode(brand.id);
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
            <table className="brand-table">
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
                      <td>{brand.name || "-"}</td>
                      <td>{brand.description || "-"}</td>
                      <td>{brand.status ? "Active" : "Inactive"}</td>
                      <td>
                        {brand.image ? (
                          <img
                            src={BaseURL + brand.image}
                            className="brand-photo"
                          />
                        ) : (
                          // <img src={"https://clubcode-api-pos.up.railway.app/" + brand.photo}  className="brand-photo" />
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
                          onClick={() => handleDeleteBrand(brand.id)}
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
                    // disabled={!!editingCode}
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
                {/* select category (optional) */}
                <div className="form-group">
                  <Box>
                    <FormControl fullWidth size="small">
                      <InputLabel id="brand-select-label">status</InputLabel>
                      <Select
                        labelId="brand-select-label"
                        id="brand-select"
                        value={formData.status ? "1" : "0"}
                        label="status"
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <MenuItem value="">
                          <em>-- Select status --</em>
                        </MenuItem>
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
