
import { useState, useEffect, } from "react";
import request from "../../../utils/request";
import { alertError, alertSuccess, confirmDelete } from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import "../../../style/feature.css";
import "./expense.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
import dayjs from "dayjs";
const Expanse = () => {  
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Expense, setExpense] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    category: "",
    desc: "",
    amount: "",
    expense_date: "",
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredExpense.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpense = filteredExpense.slice(startIndex, endIndex);

  useEffect(() => {
    fetchExpense();
  }, [formData]);
  

  useEffect(() => {
    if(searchKeyword.trim()) {
      const filtered =  Expense.filter(
        (ex) => (ex.category && ex.category.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFilteredExpense(filtered);
    }
    else {
      setFilteredExpense(Expense);
    }
  }, [searchKeyword, Expense]);

  const fetchExpense = async() => {
      try{
        setLoading(true);
      const res = await request("/api/expense", "get")
      setLoading(false);
      if(res) {
        setExpense(res.expense || []);
      }
      }catch(error) {
        setLoading(false);
        alertError({text: error?.message || "Failed to fetch expense"});
      }
  };
  const handleFormSubmit = async () => {
    try{
      const dataForm = {
        category: formData.category,
        description: formData.desc,
        amount: formData.amount,
        expense_date: formData.expense_date
      };

      let method = "post";
      let url = "/api/expense";
      if(editingCode) {
        dataForm.id = editingCode;
        method = "put";
      }

      setLoading(true);
      const res = await request(url, method, dataForm);
      if(res) {
        setShowForm(false);
        alertSuccess({title: "Success!", text: editingCode ? "Expense updated successfully" : "Expense created successfully"});
        setLoading(false);
        fetchExpense();
      }
    }catch(error) {
      alertError({text: error?.message || "Failed to save expense"});
    }
  };
  
    const handleAddExpense = () => {
    setShowForm(true);
    setEditingCode(null);
    setFormData({});
  };

  const handleEditexpense = (ex) => {
    setShowForm(true);
    setEditingCode(ex.id);
    setFormData({
      id: ex.id,
      category: ex.category || "",
      desc: ex.description || "",
      amount: ex.amount || "",
      expense_date: ex.expense_date || "",
    });
  };

  const handleDeleteexpense = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/expense/${id}`, "DELETE");
      fetchExpense();
      setLoading(false);
    });
  };


  return (
    <>
      <div className="expense-container">
        <div className="expense-header">
          <h1 className="product-title">Expense Management</h1>
          <button className="btn-add-product" onClick={handleAddExpense}>
            + Add New Expense
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
            <span>Expense per page</span>
          </div>

          <div className="search-box">
            <label>Search Expense:</label>
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
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpense.length > 0 ? (
                  paginatedExpense.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.id}</td>
                      <td>{expense.category || "-"}</td>
                      <td>{expense.description || "-"}</td>
                      <td>{expense.amount}</td>
                      <td>
                        {dayjs(expense.expanse_date).format("YYYY-MM-DD")}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditexpense(expense)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteexpense(expense.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No Expense found
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
          {Math.min(endIndex, filteredExpense.length)} of{" "}
          {filteredExpense.length} Expense
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
                <h2>{editingCode ? "Edit expense" : "Add New expense"}</h2>
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
                  <label>Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    // disabled={!!editingCode}
                    placeholder="Enter category"
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

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="Enter amount"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Expense Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expense_date || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expense_date: e.target.value,
                      })
                    }
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

export default Expanse;
