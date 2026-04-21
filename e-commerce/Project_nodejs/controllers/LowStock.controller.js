const logError = require("../middleware/logError");
const { Op, json } = require("sequelize");
const { Product } = require("../models");
const LowStock = async (req, res) => {
  try {
    const lowStock = await Product.findAll({
      where: {
        stockQuantity: {
          [Op.lt]: 10,
        },
      },
    });
    if(lowStock <= 10){
        return(
            res.json({
                data: lowStock,
                count: lowStock.length
            })
        )
    }
  } catch (err) {
    logError("LowStock", err, res);
  }
};
module.exports = { LowStock };
