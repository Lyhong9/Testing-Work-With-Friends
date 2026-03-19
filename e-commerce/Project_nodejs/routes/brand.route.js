const {
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getOneBrand
} = require("../controllers/brand.controller");
const {uploadAny} = require("../middleware/uploads/upload");
const {validate_token} = require("../middleware/auth");
const brandRouter = (app) => {
  app.get("/api/brand", validate_token(), getBrand);
  app.get("/api/brand/one", getOneBrand);
  app.post("/api/brand", uploadAny, createBrand);
  app.put("/api/brand", uploadAny, updateBrand);
  app.delete("/api/brand/:id", deleteBrand);
};

module.exports = brandRouter;
