import React, {useEffect, useState } from "react";
import "./LowStock.css";
import tele from "../../../../public/telegram-logo-11 (1).png";
import request  from "../../../utils/request";
import Layout from "../../../components/Layout";

const LowStockAlert = () => {

  const [stockAlert, setStockAlert] = useState(true);
  const [OutOfstockAlert, SetOutOfstockAlert] = useState(true);

  // action low stock 
  useEffect(() => {
  const interval = setInterval(() => {
    if (stockAlert) {
      request("/api/lowstock", "get");
    }
  }, 36000); // 1 hour

  return () => clearInterval(interval); // cleanup
}, [stockAlert]);

// action out of stock alert 
useEffect(() => {
  const interval = setInterval(() => {
    if (OutOfstockAlert) {
      request("/api/outofstock", "get");
    }
  }, 3600000); // 1 hour

  return () => clearInterval(interval); // cleanup
  
}, [OutOfstockAlert]);

 <Layout stockAlert={stockAlert} OutOfstockAlert={OutOfstockAlert} /> 

const handleToCheck = (e) => {
  setStockAlert(e.target.checked);
};

const handleToCheckOut = (e) => {
  SetOutOfstockAlert(e.target.checked);
};
  
  return (
    <div className="telegram-container">
      
      {/* HEADER */}
      <div className="telegram-header">
        {/* <img src={tele} alt="telegram" className="telegram-logo" width={50}  /> */}
        <div>
          <h2>Telegram Integration</h2>
          <p>
            Connect your inventory ecosystem to Telegram for real-time critical
            stock alerts and automated daily summaries.
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="telegram-body">

        {/* LEFT CARD */}
        <div className="card left-card">
          <span className="status">● DISCONNECTED</span>
          <h3>Bot Connection Required</h3>
          <p>
            To receive alerts, you must first add our automated agent to your
            preferred communication channel.
          </p>

          <div className="guide">
            <p><b>Instruction Guide:</b></p>
            <ol>
              <li>Open Telegram and search for <b>@LowStockAlertBot</b></li>
              <li>Start a chat or add it to your group</li>
              <li>Send the command <code>/start</code></li>
            </ol>
          </div>

          <button className="btn-primary">Connect Telegram Bot</button>
        </div>

        {/* RIGHT CARD */}
        <div className="card right-card">
          <h3>Alert Logic</h3>

          <label className="toggle">
            <span>Low Stock Alerts</span>
            <input type="checkbox" checked={stockAlert} onChange={handleToCheck}  />
          </label>

          <div className="toggle">
            <span>Out Of Stock Alert </span>
            <input type="checkbox" checked={OutOfstockAlert} onChange={handleToCheckOut} />
          </div>

          <div className="toggle">
            <span>Daily Summary Reports</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="toggle">
            <span>Restock Confirmations</span>
            <input type="checkbox" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="telegram-footer">

        <div className="card">
          <h4>Channel Configuration</h4>
          <input
            type="text"
            placeholder="e.g. -1001423859"
            className="input"
          />
          <button className="btn-secondary">Save Config</button>
        </div>

        <div className="card">
          <h4>Connectivity Validation</h4>
          <p>
            Use the test action below to verify connection.
          </p>
          <button className="btn-outline">
            ▶ Send Test Notification
          </button>
        </div>

      </div>
    </div>
  );
};

export default LowStockAlert;