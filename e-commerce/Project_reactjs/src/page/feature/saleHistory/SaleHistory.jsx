import { useState, useEffect } from "react";
import request from "../../../utils/request";
import {
  alertError,
  alertSuccess,
  confirmDelete,
} from "../../../swertalert/AlertSuccess";
import { BaseURL } from "../../../utils/BaseURL";
import "../../../style/feature.css";
import "./salehistory.css";
import "./salehi2.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import GlobleData from "../../../store/GlobleData";
const SaleHistory = () => {
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Sale, setSale] = useState([]);
  const [filteredSale, setFilteredSale] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    desc: "",
    status: "",
  });

  // Pagination calculation
  // Pagination calculation
  const totalPages = Math.ceil(filteredSale.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSale = filteredSale.slice(startIndex, endIndex);
  
  const getSale = async () =>{
    try {
      setLoading(true);
      const res = await request("/api/sale");
      if (res) {
        setSale(res.sales);
        setFilteredSale(res.sales);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Sale:", error);
    }
  }

  useEffect(() => {
    getSale();
  }, []);

  const handleEditSale = (sale) => {
    setEditingCode(sale.id);
    setFormData({
      id: sale.id,
      name: sale.name,
      desc: sale.desc,
      status: sale.status,
    });
    setShowForm(true);
  };

  const handleDeleteSale = async (sale) => {
    try {
      setLoading(true);
      const res = await request(`/api/sale/${sale.id}`, "delete");
      if (res) {
        alertSuccess({ text: "Sale deleted successfully" });
        getSale();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting Sale:", error);
    }
  };


  return (
    <>
      <div className="category-container">
        <div className="sales-container">
          {/* Header */}
          <div className="sales-header">
            <div>
              <h2>Sales History</h2>
              <p>
                Review and manage all transactional records across your
                enterprise
              </p>
            </div>

            <div className="header-actions">
              <button className="btn">
                <i className="bi bi-filetype-csv"></i> Export CSV
              </button>
              <button className="btn">
                <i className="bi bi-printer"></i> Print PDF
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="sales-cards">
            {/* Total Sales */}
            <div className="card">
              <div className="card-top">
                <div className="icon-bg blue">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <span className="percent up">+12.5%</span>
              </div>
              <p className="title">Total Sales</p>
              <h3>$1,429,500.00</h3>
            </div>

            {/* Avg Order */}
            <div className="card">
              <div className="card-top">
                <div className="icon-bg green">
                  <i className="bi bi-bag-check"></i>
                </div>
                <span className="percent up">+4.2%</span>
              </div>
              <p className="title">Avg. Order Value</p>
              <h3>$842.20</h3>
            </div>

            {/* Sales Growth */}
            <div className="card dark">
              <div className="card-top">
                <div className="icon-bg purple">
                  <i className="bi bi-bar-chart-line"></i>
                </div>
                <span className="badge">Quarterly Goal</span>
              </div>
              <p className="title">Sales Growth</p>
              <h3>+18.4%</h3>
            </div>
          </div>
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
            <span>sale per page</span>

            <div className="filter-group">
              <div className="filter-item">
                <label>
                  <span>
                    <i className="bi bi-calendar-event"></i>
                  </span>
                  From
                </label>
                <input type="date" />
              </div>

              <div className="filter-item">
                <label>
                  <span>
                    <i className="bi bi-funnel"></i>
                  </span>
                  To
                </label>
                <input type="date" />
              </div>
            </div>
          </div>

          <div className="search-box">
            <label>Search Sale History:</label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        
          <div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>invoiceId</th>
                  <th>totalAmount</th>
                  <th>paymentMethod</th>
                  <th>productId</th>
                  <th>quantity</th>
                  <th>price</th>
                  <th>image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSale.length > 0 ? (
                  paginatedSale.map((Sale) => (
                    <tr key={Sale.id}>
                      <td>{Sale.id}</td>
                      <td>{Sale.invoiceId || "-"}</td>
                      <td>{Sale.totalAmount || "-"}</td>
                      <td>{Sale.paymentMethod}</td>
                      {
                        Sale.saleItems.map((saleItem) => (
                         <>
                            <td>{saleItem.productId}</td>
                            <td>{saleItem.quantity}</td>
                            <td>{saleItem.price}</td>
                            <td><img src={BaseURL + saleItem.product.image} alt="" style={{width: "30px", height: "30px"}} /></td>
                         </>
                        ))
                      }
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditSale(Sale)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteSale(Sale.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No Sale found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        {/* filter page current table  */}
        <div className="pagination-info">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredSale.length)} of{" "}
          {filteredSale.length} Sale
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

export default SaleHistory;
