import React from "react";
import "../../../style/feature.css";
import { useState, useEffect } from "react";
import "./allstyle.css";
import request from "../../../utils/request";
import {alertSuccess, confirmDelete, alertError} from "../../../swertalert/AlertSuccess";
import {BaseURL} from "../../../utils/BaseURL";
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


  // Pagination calculation
  const totalPages = Math.ceil(filteredRole.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRole = filteredRole.slice(startIndex, endIndex);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
       setLoading(true);
      const response = await request("/api/role", "GET");
      console.log(response);
      if(response.success){
        setLoading(false);
        setRole(response.data);
      }
    } catch (error) {
      console.error("Error fetching Role:", error);
    }
  }


  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = Role.filter((Role) =>
        Role.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredRole(filtered);
    }
    else {
      setFilteredRole(Role);
    }
    setCurrentPage(1);
  }, [searchKeyword, Role]);

  const handleView = (Role) => {
    console.log(Role);
  };


  return (
    <>
      <div className="Role-container">
        {/* search and ad new  */}
        <div className="Role-header">
          <h1 className="Role-title">Role Management</h1>
          {/* <button className="btn-add-Role" onClick={handleAddRole}>
            + Add New Role
          </button> */}
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
                      <td>{
                          Role.permissions
                            ?.map((permission) => permission.name)
                            .join(", ")
                        }</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleView(Role)}
                        >
                          ✎ View
                        </button>
                        {/* <button
                          className="btn-delete"
                          onClick={() => handleDeleteRole(Role.id)}
                        >
                          🗑 Delete
                        </button> */}
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
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredRole.length)} of {filteredRole.length}{" "}
          Role
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
    </>
  );
};

export default Role;
