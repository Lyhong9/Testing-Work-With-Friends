const {
  getCategories,
  createCategory,
  updaetCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const {validate_token} = require('../middleware/auth');
const categoryRouter = (app) => {
  app.get("/api/category", validate_token, getCategories);
  app.post("/api/category", validate_token, createCategory);
  app.put("/api/category", validate_token, updaetCategory);
  app.delete("/api/category/:id", validate_token, deleteCategory);
};

module.exports = categoryRouter;
