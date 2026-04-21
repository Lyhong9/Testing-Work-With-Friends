const logError = require("../middleware/logError");
const { Op } = require("sequelize");
const { Product } = require("../models");
const { alertLowStock,  alertOutOfStock } = require("../util/sentTelegram");

const LowStock = async (req, res) => {
  try {
    const lowStock = await Product.findAll({
      where: {
        stockQuantity: {
          [Op.lt]: 10,
        },
      },
    });

    // Check if there are any products
    if (lowStock.length > 0) {
      await alertLowStock(lowStock);
    }

    return res.json({
      success: true,
      count: lowStock.length,
      data: lowStock,
    });

  } catch (err) {
    logError("LowStock", err, res);
  }
};

const alertOfStock = async (req, res) => {
  try {
    const outOfStock = await Product.findAll({
      where: {
        stockQuantity: {
          [Op.eq]: 0,
        },
      },
    });

    // ✅ Send alert only if there ARE products
    if (outOfStock.length > 0) {
      await alertOutOfStock(outOfStock);
    }

    return res.json({
      success: true,
      count: outOfStock.length,
      data: outOfStock,
    });

  } catch (err) {
    logError("OutOfStock", err, res);
  }
};

module.exports = { LowStock, alertOfStock };