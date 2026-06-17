
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
import { Descriptions } from "antd";
import dayjs from "dayjs";
const Permission = () => {  
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Permission, setPermission] = useState([]);
  const [filteredPermission, setFilteredPermission] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    Description: "",
  });
  const [Role, setRole] = useState([]);
  // Pagination calculation
  const totalPages = Math.ceil(filteredPermission.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPermission = filteredPermission.slice(startIndex, endIndex);

  useEffect(() => {
    if(searchKeyword.trim()) {
      const filtered =  Permission.filter(
        (cate) => (cate.description && cate.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFilteredPermission(filtered);
    }
    else {
      setFilteredPermission(Permission);
    }
  }, [searchKeyword, Permission]);

  async function fetcPermission() {
      try{
        setLoading(true);
      const res = await request("/api/permission", "get")
      console.log(res);
      setLoading(false);
      if(res) {
        setPermission(res.data || []);
      }
      }catch(error) {
        setLoading(false);
        alertError({text: error?.message || "Failed to fetch permission"});
      }
  }


  useEffect(() => {
    fetcPermission();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try{
      const dataForm = {
        name: formData.name,
        description: formData.description,
      };

      let method = "post";
      let url = "/api/permission";
      if(editingCode) {
        method = "put";
        url  = `/api/permission/${editingCode}`;
      }

      setLoading(true);
      const res = await request(url, method, dataForm);
      if(res) {
        setShowForm(false);
        alertSuccess({title: "Success!", text: editingCode ? "permission updated successfully" : "permission created successfully"});
        setLoading(false);
        fetcPermission();
      }
    }catch(error) {
      setLoading(false);
      alertError({text: error?.message || "Failed to save permission"});
    }
  };
  
  const handleAddPermission = () => {
    setShowForm(true);
    setEditingCode(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleEditPermission = (per) => {
    setShowForm(true);
    setEditingCode(per.id);
    setFormData({
      name: per.name || "",
      description: per.description || "",
    });
  };

  const handleDeletePer = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/permission/${id}`, "DELETE");
      fetcPermission();
      setLoading(false);
    });
  };


  return (
    <>
      <div className="user-container">  
        <div className="user-header">
          <h1 className="product-title">Permission Management</h1>
          <button className="btn-add-product" onClick={handleAddPermission}>
            + Add New Permission
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
                  <th>Path</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPermission.length > 0 ? (
                  paginatedPermission.map((Per) => (
                    <tr key={Per.id}>
                      <td>{Per.id}</td>
                      <td>{Per.name || "-"}</td>
                      <td>{Per.description || "-"}</td>
                      <td>{
                          dayjs(Per.createdAt).format("YYYY-MM-DD")
                        }</td>
                      <td>{dayjs(Per.updateAt).format("YYYY-MM-DD")}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditPermission(Per)}
                        >
                          ✎ Edit
                        </button>
                        {
                          Per.email == "Vothanarern@gmail.com" ? null : (
                            <button
                              className="btn-delete"
                              onClick={() => handleDeletePer(Per.id)}
                            >
                              🗑 Delete
                            </button>
                          )
                        }
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
          {Math.min(endIndex, filteredPermission.length)} of{" "}
          {filteredPermission.length} User
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
                <h2>{editingCode ? "Edit Permission" : "Add New Permission"}</h2>
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
                  <label>Path *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    // disabled={!!editingCode}
                    placeholder="Enter product path"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>description</label>
                  <input
                    type="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter description"
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

export default Permission;
