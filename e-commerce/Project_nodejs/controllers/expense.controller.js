const { Expense } = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");

// GET EXPENSE
const getExpense = async (req, res) => {
  try {
    const { search } = req.query;

    let where = {};

    if (search) {
      where = {
        [Op.or]: [
          { description: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Expense.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      expense: rows,
    });
  } catch (err) {
    logError("GetExpense", err, res);
  }
};

// CREATE
const createExpense = async (req, res) => {
  try {
    const { category, description, amount, expense_date } = req.body || {};

    if (!category || !amount) {
      return res.status(400).json({
        success: false,
        message: "category and amount are required!",
      });
    }

    const response = await Expense.create({
      category,
      description,
      amount,
      expense_date,
    });

    return res.status(201).json({
      success: true,
      expense: response,
    });
  } catch (err) {
    logError("CreateExpense", err, res);
  }
};

// UPDATE
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, description, amount, expense_date } = req.body || {};

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required!",
      });
    }

    const [updated] = await Expense.update(
      {
        category,
        description,
        amount,
        expense_date,
      },
      {
        where: { id },
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
    });
  } catch (err) {
    logError("updateExpense", err, res);
  }
};

// DELETE
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense id is required",
      });
    }

    const deleted = await Expense.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    logError("deleteExpense", err, res);
  }
};

module.exports = {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};