import { useState, useEffect } from "react";
import request from "../../../utils/request";
import {
  alertError,
  alertSuccess,
  confirmDelete,
} from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import "../../../style/feature.css";
import "./inventory.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
import dayjs from "dayjs";
const Inventory = () => {
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [inventory, setinventory] = useState([]);
  const [filteredinventory, setFilteredinventory] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    product_id: "",
    item_name: "",
    quantity: "",
    unit_price: "",
    supplier: "",
    transaction_type: "",
    transaction_date: "",
    transaction_quantity: "",
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredinventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedinventory = filteredinventory.slice(startIndex, endIndex);

  useEffect(() => {
    fetchinventory();
  }, []);7

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = inventory.filter(
        (ex) =>
          ex.category &&
          ex.category.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
      setFilteredinventory(filtered);
    } else {
      setFilteredinventory(inventory);
    }
  }, [searchKeyword, inventory]);

  const fetchinventory = async () => {
    try {
      setLoading(true);
      const res = await request("/api/inventory", "get");
      setLoading(false);
      if (res) {
        setinventory(res.inventory || []);
      }
    } catch (error) {
      setLoading(false);
      alertError({ text: error?.message || "Failed to fetch inventory" });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataForm = {
        product_id: formData.product_id,
        item_name: formData.item_name,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        supplier: formData.supplier,
        transaction_type: formData.transaction_type,
        transaction_date: formData.transaction_date,
        transaction_quantity: formData.transaction_quantity,
      };

      let method = "post";
      let url = "/api/inventory";
      if (editingCode) {
        dataForm.id = editingCode;
        url = `/api/inventory/${editingCode}`;
        method = "put";
      }

      setLoading(true);
      const res = await request(url, method, dataForm);
      if (res) {
        setShowForm(false);
        alertSuccess({
          title: "Success!",
          text: editingCode
            ? "inventory updated successfully"
            : "inventory created successfully",
        });
        setLoading(false);
        await fetchinventory();
      }
    } catch (error) {
      alertError({ text: error?.message || "Failed to save inventory" });
    }
  };

  const handleAddinventory = () => {
    setShowForm(true);
    setEditingCode(null);
    setFormData({});
  };

  const handleEditinventory = (inventory) => {
    setShowForm(true);
    setEditingCode(inventory.id);
    setFormData({
      id: inventory.id,
      product_id: inventory.productId || "",
      item_name: inventory.item_name || "",
      quantity: inventory.quantity || "",
      unit_price: inventory.unit_price || "",
      supplier: inventory.supplier || "",
      transaction_type: inventory.transaction_type || "",
      transaction_date: inventory.transaction_date || "",
      transaction_quantity: inventory.transaction_quantity || "",
    });
  };

  const handleDeleteinventory = async (id) => {
    await confirmDelete(async () => {
      setLoading(true);
      await request(`/api/inventory/${id}`, "DELETE");
      fetchinventory();
      setLoading(false);
    });
  };

  const [products, setProducts] = useState([]);
  const fetchProduct = async () => {
    try {
      const response = await request("/api/product", "GET");
      console.log(response);
      if (response && response.product) {
        setProducts(response.product);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const transaction = async (inventory) => {};
  return (
    <>
      <div className="inventory-container">
        <div className="inventory-header">
          <h1 className="product-title">inventory Management</h1>
          <button className="btn-add-product" onClick={handleAddinventory}>
            + Add New inventory
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
            <span>inventory per page</span>
          </div>

          <div className="search-box">
            <label>Search inventory:</label>
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
                  <th>ID </th>
                  <th>Item name</th>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Supplier</th>
                  <th>Inventory Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedinventory.length > 0 ? (
                  paginatedinventory.map((inventory) => (
                    <tr key={inventory.id}>
                      <td>{inventory.id}</td>
                      <td>{inventory.item_name || "-"}</td>
                      <td>{inventory.productId}</td>
                      <td>{inventory.quantity || "-"}</td>
                      <td>{inventory.unit_price || "-"}</td>
                      <td>{inventory.supplier || "-"}</td>
                      <td>
                        {dayjs(inventory.expanse_date).format("YYYY-MM-DD")}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-transaction"
                          onClick={() => transaction(inventory)}
                        >
                          📦 Transaction
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditinventory(inventory)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteinventory(inventory.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No inventory found
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
          {Math.min(endIndex, filteredinventory.length)} of{" "}
          {filteredinventory.length} inventory
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
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingCode ? "Edit Inventory" : "Add New Inventory"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowForm(false)}
                  ></button>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      {/* Product ID */}
                      <div className="col-md-6 mb-3">
                        <FormControl
                          fullWidth
                          size="small"
                          className="inventory-select-field"
                        >
                          <InputLabel id="product-id-label">
                            Product ID
                          </InputLabel>
                          <Select
                            labelId="product-id-label"
                            id="product-id-select"
                            value={formData.product_id || ""}
                            label="Product ID"
                            required
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                product_id: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="">
                              <em>-- Select Product --</em>
                            </MenuItem>

                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.id} - {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Product Name */}
                      <div className="col-md-6 mb-3">
                        <FormControl
                          fullWidth
                          size="small"
                          className="inventory-select-field"
                        >
                          <InputLabel id="product-name-label">
                            Product Name
                          </InputLabel>
                          <Select
                            required
                            labelId="product-name-label"
                            id="product-name-select"
                            value={formData.item_name || ""}
                            label="Product Name"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                item_name: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="">
                              <em>-- Select Product --</em>
                            </MenuItem>

                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.name}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                          required
                          type="number"
                          className="form-control"
                          value={formData.quantity || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Unit Price</label>
                        <input
                          type="number"
                          required
                          className="form-control"
                          value={formData.unit_price || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              unit_price: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Supplier */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Supplier</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          value={formData.supplier || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              supplier: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Transaction Type */}
                      <div className="col-md-6 mb-3">
                        <FormControl
                          fullWidth
                          size="small"
                          className="inventory-select-field"
                        >
                          <InputLabel id="transaction-type-label">
                            Transaction Type
                          </InputLabel>
                          <Select
                            required
                            labelId="transaction-type-label"
                            id="transaction-type-select"
                            value={formData.transaction_type || ""}
                            label="Transaction Type"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                transaction_type: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="">
                              <em>-- Select Type --</em>
                            </MenuItem>

                            <MenuItem value="In">IN</MenuItem>
                            <MenuItem value="Out">OUT</MenuItem>
                          </Select>
                        </FormControl>
                      </div>

                      {/* Transaction Quantity */}
                      {editingCode ? (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Transaction Quantity
                          </label>
                          <input
                            required={editingCode ? true : false}
                            type="number"
                            className="form-control"
                            value={formData.transaction_quantity || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                transaction_quantity: e.target.value,
                              })
                            }
                          />
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Transaction Date */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Transaction Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.transaction_date || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              transaction_date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-primary">
                      {editingCode ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/*end Modal alert add  */}
      </div>
    </>
  );
};

export default Inventory;
