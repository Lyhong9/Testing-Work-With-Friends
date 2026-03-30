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
  app.get("/api/brand/one", validate_token(), getOneBrand);
  app.post("/api/brand", validate_token(), uploadAny, createBrand);
  app.put("/api/brand", validate_token(), uploadAny, updateBrand);
  app.delete("/api/brand/:id", validate_token(), deleteBrand);
};

module.exports = brandRouter;
