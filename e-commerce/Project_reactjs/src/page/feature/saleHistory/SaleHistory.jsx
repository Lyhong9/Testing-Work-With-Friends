import { useState, useEffect, useRef, useMemo } from "react";
import request from "../../../utils/request";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { confirmDelete } from "../../../swertalert/AlertSuccess";
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
import { Modal, Button, Space, Image } from "antd";
const SaleHistory = () => {
  const MAX_PHOTO_SIZE_MB = 10;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [Sale, setSale] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [ViweDetail, setViweDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filteredSale, setFilteredSale] = useState([]);
  const [DatetimeTo, setDatetimeTo] = useState(null);
  const [DateetimeFrom, setDatetimeFrom] = useState(null); // Pagination calculation
  // Pagination calculation
  const finalFilteredSale = useMemo(() => {
    let filtered = Sale;

    // Apply search filter
    if (searchKeyword.trim()) {
      filtered = filtered.filter((sale) =>
        sale.saleItems[0]?.product?.name
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase()),
      );
    }

    // Apply date filter
    if (DateetimeFrom || DatetimeTo) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        const fromDate = DateetimeFrom ? new Date(DateetimeFrom) : null;
        const toDate = DatetimeTo ? new Date(DatetimeTo) : null;

        if (fromDate && toDate) {
          return saleDate >= fromDate && saleDate <= toDate;
        } else if (fromDate) {
          return saleDate >= fromDate;
        } else if (toDate) {
          return saleDate <= toDate;
        }
        return true;
      });
    }

    return filtered;
  }, [Sale, searchKeyword, DateetimeFrom, DatetimeTo]);

  useEffect(() => {
    setFilteredSale(finalFilteredSale);
  }, [finalFilteredSale]);

  const totalPages = Math.ceil(filteredSale.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSale = filteredSale.slice(startIndex, endIndex);

  const getSale = async () => {
    try {
      const res = await request("/api/sale");
      if (res) {
        console.log(res.sales);
        setSale(res.sales || []);
      }
    } catch (error) {
      console.error("Error fetching Sale:", error);
    }
  };

  useEffect(() => {
    getSale();
  }, []);

  const handleViweDetail = (sale) => {
    setViweDetail(sale);
    setShowForm(true);
  };

  const handleDeleteSale = async (sale) => {
    await confirmDelete(async () => {
      await request(`/api/sale/${sale.id}`, "DELETE");
      getSale();
    });
  };

  // print TO CSV
  const exportToCSV = () => {
    const filename = "sales_history.csv";
    const headers = [
      "Sale ID",
      "Invoice ID",
      "Tax",
      "Payment Method",
      "User ID",
      "Created At",
      "Product ID",
      "Quantity",
      "Price",
      "Total Amount",
    ];
    let data = [headers.join(",")];

    Sale.forEach((sale) => {
      sale.saleItems.forEach((item) => {
        const row = [
          sale.id,
          `"${sale.invoiceId}"`,
          sale.tax,
          sale.paymentMethod,
          sale.userId,
          new Date(sale.createdAt).toLocaleDateString(),
          item.productId,
          item.quantity,
          item.price,
          sale.totalAmount,
        ];
        data.push(row.join(","));
      });
    });

    const blob = new Blob([data.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  // print pdf
  const ref = useRef();

  const downloadPDF = async () => {
    const element = ref.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("document.pdf");
  };

  let totalSales = 0;
  Sale.forEach((sale) => {
    totalSales += parseFloat(sale.totalAmount);
  });

  return (
    <>
      <div className="category-container" ref={ref}>
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
              <button className="btn" onClick={exportToCSV}>
                <i className="bi bi-filetype-csv"></i> Export CSV
              </button>
              <button className="btn" onClick={downloadPDF}>
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
              <h3>${totalSales.toFixed(2)}</h3>
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
                <input
                  type="date"
                  onChange={(e) => setDatetimeFrom(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <label>
                  <span>
                    <i className="bi bi-funnel"></i>
                  </span>
                  To
                </label>
                <input
                  type="date"
                  onChange={(e) => setDatetimeTo(e.target.value)}
                />
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
                <th>payment</th>
                <th>productId</th>
                <th>qty</th>
                <th>price</th>
                <th>total</th>
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
                    <td className="text-success fw-bold">
                      {Sale.paymentMethod.toUpperCase()}
                    </td>

                    <td>{Sale.saleItems?.[0]?.productId || "-"}</td>
                    <td>{Sale.saleItems?.[0]?.quantity || "-"}</td>
                    <td className="text-success fw-bold">
                      ${Sale.saleItems?.[0]?.price || "-"}
                    </td>
                    <td>
                      <span className="text-success fw-bold">
                        ${Sale.totalAmount || "-"}
                      </span>
                    </td>
                    <td>
                      {Sale.saleItems?.[0]?.product?.image && (
                        <Image
                          src={BaseURL + Sale.saleItems[0].product.image}
                          alt="product"
                          style={{ width: "30px", height: "30px" }}
                        />
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleViweDetail(Sale)}
                      >
                        ✎ View
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteSale(Sale)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    No Sale found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* filter page current table  */}
        <div className="pagination-info">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSale.length)}{" "}
          of {filteredSale.length} Sale
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

      <Modal
        open={showForm}
        onCancel={() => setShowForm(false)}
        title="Sale Detail"
        footer={null}
        ref={ref}
      >
        {/* Sale Info */}
        <div className="mb-4">
          <h5 className="mb-3">Sale Information</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Invoice</th>
                  <th>Total</th>
                  <th>Tax</th>
                  <th>Payment</th>
                  <th>User</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ViweDetail?.id}</td>
                  <td>{ViweDetail?.invoiceId}</td>
                  <td>${ViweDetail?.totalAmount}</td>
                  <td>${ViweDetail?.tax}</td>
                  <td>
                    <span className="badge bg-success">
                      {ViweDetail?.paymentMethod}
                    </span>
                  </td>
                  <td>{ViweDetail?.userId}</td>
                  <td>{new Date(ViweDetail?.createdAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sale Items */}
        <div className="mb-4">
          <h5 className="mb-3">Sale Items</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {ViweDetail?.saleItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productId}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h5 className="mb-3">Product Details</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-secondary">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {ViweDetail?.saleItems?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.name}</td>
                    <td>{item.product?.description}</td>
                    <td>
                      <Image
                        src={BaseURL + item.product?.image}
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Space className="d-flex justify-content-end align-item-end">
          <Button type="primary" onClick={() => window.print()}>
            Print PDF
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default SaleHistory;
