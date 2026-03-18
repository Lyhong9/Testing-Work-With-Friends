const { create } = require("node:domain");
const {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOne
} = require("../controllers/product.controller");
const {uploadAny} = require("../middleware/uploads/upload");
const productRouter = (app) => {
  app.get("/api/product", getProduct);
  app.get("/api/product/one", getProductOne);
  app.post("/api/product", uploadAny, createProduct);
  app.put("/api/product", uploadAny, updateProduct);
  app.delete("/api/product/:id", deleteProduct);
};

module.exports = productRouter;
