
import { useState, useEffect, } from "react";
import request from "../../../utils/request";
import { alertError, alertSuccess, confirmDelete } from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import "../../../style/feature.css";
import "./ManageUser.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
const ManageUser = () => {  
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [User, setUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    status: "",
    role_id: "",
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredUser.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUser = filteredUser.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUser();
  }, []);
  

  useEffect(() => {
    if(searchKeyword.trim()) {
      const filtered =  User.filter(
        (cate) => (cate.name && cate.name.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFilteredUser(filtered);
    }
    else {
      setFilteredUser(User);
    }
  }, [searchKeyword, User]);

  const fetchUser = async() => {
      try{
        setLoading(true);
      const res = await request("/api/user", "get")
      console.log(res);
      setLoading(false);
      if(res) {
        setUser(res.users || []);
      }
      }catch(error) {
        setLoading(false);
        alertError({text: error?.message || "Failed to fetch user"});
      }
  };
  const handleFormSubmit = () => {
    try{
      const dataForm = {
        name: formData.username,
        description: formData.email,
        status: formData.status,
      };

      let method = "post";
      let url = "/api/user";
      if(editingCode) {
        dataForm.id = editingCode;
        method = "put";
      }

      setLoading(true);
      const res = request(url, method, dataForm);
      if(res) {
        setShowForm(false);
        alertSuccess({title: "Success!", text: editingCode ? "User updated successfully" : "User created successfully"});
        setLoading(false);
        fetchUser();
      }
    }catch(error) {
      alertError({text: error?.message || "Failed to save user"});
    }
  };
  
    const handleAddUser = () => {
    setShowForm(true);
    setEditingCode(null);
    setFormData({});
  };

  const handleEdituser = (cate) => {
    setShowForm(true);
    setEditingCode(cate.id);
    setFormData({
      id: cate.id,
      name: cate.name || "",
      desc: cate.description || "",
      status: cate.status || "",
    });
  };

  const handleDeleteuser = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/user/${id}`, "DELETE");
      fetchUser();
      setLoading(false);
    });
  };


  return (
    <>
      <div className="user-container">
        <div className="user-header">
          <h1 className="product-title">User Management</h1>
          <button className="btn-add-product" onClick={handleAddUser}>
            + Add New User
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
            <span>User per page</span>
          </div>

          <div className="search-box">
            <label>Search User:</label>
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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUser.length > 0 ? (
                  paginatedUser.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{
                          user.roles?.map((role) => (
                            <span key={role}>{role.name}</span>
                          ))
                        }</td>
                      <td>{user.status ? "Active" : "Inactive"}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdituser(user)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteuser(user.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No User found
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
          {Math.min(endIndex, filteredUser.length)} of{" "}
          {filteredUser.length} User
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

export default ManageUser;
