const { create } = require("node:domain");
const {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOne
} = require("../controllers/product.controller");
const {uploadAny} = require("../middleware/uploads/upload");
const  { validate_token } = require("../middleware/auth");
const productRouter = (app) => {
  app.get("/api/product", validate_token(), getProduct);
  app.get("/api/product/one", validate_token(), getProductOne);
  app.post("/api/product", validate_token(), uploadAny, createProduct);
  app.put("/api/product", validate_token(), uploadAny, updateProduct);
  app.delete("/api/product/:id", validate_token(), deleteProduct);
};

module.exports = productRouter;
