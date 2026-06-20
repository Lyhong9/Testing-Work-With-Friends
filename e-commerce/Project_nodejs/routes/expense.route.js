const {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expense.controller");

const ExpenseRoute = (app) => {
  app.get("/api/expense", getExpense);
  app.post("/api/expense", createExpense);
  app.put("/api/expense/:id", updateExpense);
  app.delete("/api/expense/:id", deleteExpense);
};

module.exports = ExpenseRoute;
