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
import { Space, Table, Modal, Button } from "antd";
const Inventory = () => {
  const [inventory, setinventory] = useState([]);
  const [filteredinventory, setFilteredinventory] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [showTransaction, setShowTransaction] = useState(false);

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
  }, []);
  7;

  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = inventory.filter(
        (ex) =>
          ex.item_name &&
          ex.item_name.toLowerCase().includes(searchKeyword.toLowerCase()),
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

  const transaction = async (inventory) => {
    setShowTransaction(true);
    setTransactionData(inventory);
  };

  const handleCancel = () => {
    setShowTransaction(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: "ID",
      align: "center",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Inventory ID",
      align: "center",
      dataIndex: "inventory_id",
      key: "inventory_id",
      render: (index, data) => <span>{transactionData.item_name}</span>,
    },
    {
      title: "Quantity",
      align: "center",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Transaction Type",
      align: "center",
      dataIndex: "transaction_type",
      key: "transaction_type",
    },
    {
      title: "Transaction Date",
      align: "center",
      dataIndex: "transaction_date",
      key: "transaction_date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
  ];
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
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%" }}
            >
              <div className="modal-header">
                <h2>{editingCode ? "Edit inventory" : "Add New inventory"}</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-3">
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

                <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-outline-primary pl-5 pr-5"
                  >
                    {editingCode ? "Update" : "Create"}
                  </button>
                </Space>
              </form>
            </div>
          </div>
        )}
        {/*end Modal alert add  */}

        <Modal
          title={"Inventory Transactions"}
          open={showTransaction}
          onCancel={handleCancel}
          footer={false}
          width={1000}
        >
          <div>
            <Table
              dataSource={transactionData.inventoryTransactions}
              columns={columns}
              pagination={false}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Space>
              <Button type="primary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" onClick={handlePrint}>
                Print
              </Button>
            </Space>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Inventory;
