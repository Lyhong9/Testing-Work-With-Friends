const {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const { validate_token } = require("../middleware/auth");
const ExpenseRoute = (app) => {
  app.get("/api/expense", validate_token(), getExpense);
  app.post("/api/expense", validate_token(), createExpense);
  app.put("/api/expense/:id", validate_token(), updateExpense);
  app.delete("/api/expense/:id", validate_token(), deleteExpense);
};

module.exports = ExpenseRoute;
