import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./Customer.css";
import request from "../../../utils/request";
import {alertSuccess, confirmDelete, alertError} from "../../../swertalert/AlertSuccess";
import {BaseURL} from "../../../utils/BaseURL";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const Customer = () => {
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    image: "",
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
       setLoading(true);
      const response = await request("/api/customer", "GET");
      // alertSuccess("Success!", "Operation completed successfully");
      // confirmDelete(async () => {
      //   await request(`product/${id}`, "DELETE");
      // })
      console.log("Fetch Customers response:", response);
      if(response.success){
        setLoading(false);
        setCustomers(response.customers || []);
      }
    } catch (error) {
      console.error("Error fetching Customers:", error);
    }
  }

  useEffect(() => {
    CloseModal();
  }, [showForm]);
  const CloseModal = () =>{
    if(showForm == false){
      setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          image: "",
        });
        setSelectedPhotoFile(null);
        setEditingCode(null);
        setShowForm(false);
    }
  }

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = Customers.filter((Customer) =>
        Customer.email.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredCustomers(filtered);
    }
    else {
      setFilteredCustomers(Customers);
    }
    setCurrentPage(1);
  }, [searchKeyword, Customers]);
  const handleAddCustomer = () => {
    setShowForm(true);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("password", formData.password);

      if (selectedPhotoFile) {
        payload.append("image", selectedPhotoFile);
      }

      let url = "/api/customer";
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
            ? "Customer updated successfully"
            : "Customer created successfully",
         }
        );
        setShowForm(false);
        fetchCustomers();
      } else {
        alertError("Error", response.message);
      }
    } catch (error) {
      alertError({text: error?.message || "An error occurred while saving the Customer."});
    }
  };

    const handleDeleteCustomer = async (id) => {
      await confirmDelete(async () => {
        setLoading(true);
        await request(`/api/customer/${id}`, "DELETE");
        fetchCustomers();
        setLoading(false);
      });
    };

  const handleEditCustomer = (Customer) => {
    setFormData({
      name: Customer.name || "",
      email: Customer.email || "",
      phone: Customer.phone || "",
      password: Customer.password || "",
      image: Customer.image || "",
    });

    setSelectedPhotoFile(Customer.image || null);
    setEditingCode(Customer.id);
    setShowForm(true);
  };

  const handlePhotoChange = async (event) =>{
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
      <div className="Customer-container">
        {/* search and ad new  */}
        <div className="Customer-header">
          <h1 className="Customer-title">Customer Management</h1>
          <button className="btn-add-Customer" onClick={handleAddCustomer}>
            + Add New Customer
          </button>
        </div>

        <div className="Customer-controls">
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
            <span>Customers per page</span>
          </div>

          <div className="search-box">
            <label>Search Customers:</label>
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
            <table className="Customer-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>phone</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((Customer) => (
                    <tr key={Customer.id}>
                      <td>{Customer.id}</td>
                      <td>{Customer.name || "-"}</td>
                      <td>{Customer.email || "-"}</td>
                      <td>{Customer.phone || "-"}</td>
                      <td>
                        {Customer.image ? (
                          <img
                            src={BaseURL + Customer.image}
                            className="Customer-photo"
                          />
                        ) : (
                          // <img src={"https://clubcode-api-pos.up.railway.app/" + Customer.photo}  className="Customer-photo" />
                          "-"
                        )}
                      </td>
                      <td className="actions">
                        <button className="btn-edit">
                          <VisibilityIcon
                            style={{ fontSize: 18, marginRight: 5 }}
                          />
                          View
                        </button> 

                        <button
                          className="btn-edit"
                          onClick={() => handleEditCustomer(Customer)}
                        >
                          <EditIcon style={{ fontSize: 18, marginRight: 5 }} />
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteCustomer(Customer.id)}
                        >
                          <DeleteIcon
                            style={{ fontSize: 18, marginRight: 5 }}
                          />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No Customers found
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
          {Math.min(endIndex, filteredCustomers.length)} of{" "}
          {filteredCustomers.length} Customers
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
                <h2>{editingCode ? "Edit Customer" : "Add New Customer"}</h2>
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
                    placeholder="Enter Customer name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>
                {/* phone  */}
                <div className="form-group">
                  <label>password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                  />
                </div>
                {/* phone  */}
                <div className="form-group">
                  <label>phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone"
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
                      alt="Customer preview"
                      className="Customer-photo-preview"
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

export default Customer;
