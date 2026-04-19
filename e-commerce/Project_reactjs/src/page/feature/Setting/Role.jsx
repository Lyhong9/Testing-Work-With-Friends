import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./allstyle.css";
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
const Role = () => {
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Role, setRole] = useState([]);
  const [filteredRole, setFilteredRole] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFormAddMorePermission, setShowFormAddMorePermission] =
    useState(false);
  const [editingCode, setEditingCode] = useState(null);
  // Pagination calculation
  const totalPages = Math.ceil(filteredRole.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRole = filteredRole.slice(startIndex, endIndex);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [permission, setPermission] = useState([]);
  const [subPermissions, setSubPermissions] = useState([]);
  const [formDataPermission, setformDataPermission] = useState({
    roleId: "",
    permissionId: "",
    search: "",
  });

  const fetchPermission = async () => {
    try {
      setLoading(true);
      const response = await request("/api/permission", "GET");
      // console.log(response);
      if (response) {
        setPermission(response.data);
      }
    } catch (error) {
      console.error("Error fetching Role:", error);
    }
  };
  const fetchRole = async () => {
    try {
      setLoading(true);
      const response = await request("/api/role", "GET");
      console.log(response);
      if (response.success) {
        setLoading(false);
        setRole(response.data);
      }
    } catch (error) {
      console.error("Error fetching Role:", error);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchPermission();
  }, []);

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = Role.filter((Role) =>
        Role.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredRole(filtered);
    } else {
      setFilteredRole(Role);
    }
    setCurrentPage(1);
  }, [searchKeyword, Role]);


  useEffect(() => {
    const fetchFilteredPermissions = async () => {
      try {
        const res = await request(`/api/permission?search=${formDataPermission.search}`, "GET");
        console.log("search", res);
        if (res.success) {
          setSubPermissions(res.data);
        }
      } catch (error) {
        alertError({ text: error?.message || "Failed to fetch permission" });
      }
    };
    if (formDataPermission.search) {
      fetchFilteredPermissions();
    }
  }, [formDataPermission.search]);
  const handleAddRole = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    try {
      const dataform = {
        name: formData.name,
        description: formData.description,
      };

      let url = "/api/role";
      let method = "post";
      if(editingCode) {
        dataform.id = editingCode;
        method = "put";
      }
    
      const res = await request(url, method, dataform);
      if (res) {
        setShowForm(false);
        alertSuccess({ title: "Success!", text: res?.message || "Role created successfully" });
        fetchRole();
      }
    } catch (err) {
      alertError({
        text: err?.message || "Failed to save role",
      });
    }
  };

  const handleDeleteRole = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/role/${id}`, "DELETE");
      fetchRole();
      setLoading(false);
    });
  };

  const handleEditRole = (Role) => {
    setEditingCode(Role.id);
    setFormData({
      name: Role.name,
      description: Role.description,
    });
    setShowForm(true);
  };

  const handleAddPermission = (Role) => {
    setEditingCode(Role.id);
    setShowFormAddMorePermission(true);
  };
  const handleAddMorePermission = async () => {
    try {
      const dataform = {
        roleId: editingCode,
        permissionId: formDataPermission.permissionId,
      };
      const res = await request("/api/role/addMorePermission", "POST", dataform);
      if (res) {
        setShowFormAddMorePermission(false);
        alertSuccess({
          title: "Success!",
          text: "Permission added successfully",
        });
        fetchRole();
      }
    } catch (err) {
      alertError({
        text: err?.message || "Failed to save permission",
      });
    }
  };

  return (
    <>
      <div className="Role-container">
        <div className="user-header">
          <h1 className="product-title">Role Management</h1>
          <button className="btn-add-product" onClick={handleAddRole}>
            + Add New User
          </button>
        </div>

        <div className="Role-controls">
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
            <span>Role per page</span>
          </div>

          <div className="search-box">
            <label>Search Role:</label>
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
            <table className="Role-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Permission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRole.length > 0 ? (
                  paginatedRole.map((Role) => (
                    <tr key={Role.id}>
                      <td>{Role.id}</td>
                      <td>{Role.name || "-"}</td>
                      <td>{Role.description || "-"}</td>
                      <td>
                        {Role.permissions
                          ?.map((permission) => permission.name)
                          .join(", ")}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditRole(Role)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteRole(Role.id)}
                        >
                          🗑 Delete
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleAddPermission(Role)}
                        >
                          ✎ Add Permission
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No Role found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* filter page current table  */}
        <div className="pagination-info">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredRole.length)}{" "}
          of {filteredRole.length} Role
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
      </div>

      {/* Modal alert add  */}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCode ? "Edit Brand" : "Add New Brand"}</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              {/* name product  */}
              <div className="form-group">
                <label>name *</label>
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
              {/* email  */}
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter des"
                />
              </div>
              {/* password  */}

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

      {showFormAddMorePermission && (
        <div className="modal-overlay" onClick={() => setShowFormAddMorePermission(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCode ? "Edit Brand" : "Add New Brand"}</h2>
              <button className="btn-close" onClick={() => setShowFormAddMorePermission(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddMorePermission}>
              {/* name product  */}
              {/* <div className="form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  value={formData.roldId}
                  onChange={(e) =>
                    setFormData({ ...formData, roldId: e.target.value })
                  }
                  // disabled={!!editingCode}
                  placeholder="Enter product name"
                  required
                />
              </div> */}
                <div className="form-group">
                <Box>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Group</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={formDataPermission.search}
                      label="Status"
                      onChange={(e) =>
                        setformDataPermission({ ...formDataPermission,   search: e.target.value })
                      }
                    >
                      <MenuItem value="">
                        <em>-- Select group --</em>
                      </MenuItem>
                      {
                        permission?.map((item) => (
                          <MenuItem key={item.id} value={item.description}>
                            {item.description}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div className="form-group">
                <Box>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Sub</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="status-select"
                      value={formDataPermission.permissionId}
                      label="Status"
                      onChange={(e) =>
                        setformDataPermission({ ...formDataPermission, permissionId: e.target.value })
                      }
                    >
                      <MenuItem value="">
                        <em>-- Select sub --</em>
                      </MenuItem>
                      {
                        subPermissions?.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
              </div>
              {/* password  */}

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingCode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowFormAddMorePermission(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*end Modal alert add  */}
    </>
  );
};

export default Role;
