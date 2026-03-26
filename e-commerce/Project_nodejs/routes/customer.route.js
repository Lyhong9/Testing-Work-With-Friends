const {
  getCustomer,
  Register,
  updateCustomer,
  deleteCustomer,
  getOneCustomer,
  login, 
  sendOTP,
  resetPassword,
  verifyOtp,
} = require("../controllers/customer.controller");
const {uploadAny} = require("../middleware/uploads/upload");
const {validate_token} = require("../middleware/auth");
const CustomerRouter = (app) => {
  app.get("/api/customer", getCustomer);
  app.get("/api/customer/one", getOneCustomer);
  app.post("/api/customer", uploadAny, Register);
  app.post("/api/customer/login", login);
  app.put("/api/customer", uploadAny, updateCustomer);
  app.delete("/api/customer/:id", deleteCustomer);
  app.post("/api/customer/sendOTP", sendOTP);
  app.post("/api/customer/resetPassword", resetPassword);
  app.post("/api/customer/verifyOTP", verifyOtp);
};

module.exports = CustomerRouter;
