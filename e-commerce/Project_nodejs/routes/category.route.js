const {
  getCategories,
  createCategory,
  updaetCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const {validate_token} = require('../middleware/auth');
const categoryRouter = (app) => {
  app.get("/api/category", getCategories);
  app.post("/api/category", createCategory);
  app.put("/api/category", updaetCategory);
  app.delete("/api/category/:id", deleteCategory);
};

module.exports = categoryRouter;
