const {
  getCustomer,
  Register,
  updateCustomer,
  deleteCustomer,
  getOneCustomer,
  login
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
};

module.exports = CustomerRouter;
