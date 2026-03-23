const { Sale, SaleItem, sequelize } = require("../models");
const { logError } = require("../middleware/logError");


// ✅ GET ALL SALES WITH ITEMS
const getSale = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: SaleItem,
          as: "saleItems"
        }
      ],
      order: [["id", "DESC"]]
    });

    res.status(200).json({
      success: true,
      message: "Get all sales",
      data: sales
    });

  } catch (error) {
    logError("getSale", error, res);
  }
};


// ✅ CREATE SALE WITH ITEMS + TRANSACTION
const createSale = async (req, res) => {
  const t = await sequelize.transaction(); // 🔥 start transaction

  try {
    const { invoiceId, totalAmount, tax, paymentMethod, userId, saleItems } = req.body;

    // ✅ 1. Create Sale
    const sale = await Sale.create({
      invoiceId,
      totalAmount,
      tax,
      paymentMethod,
      userId
    }, { transaction: t });

    // ✅ 2. Create SaleItems (bulk)
    if (saleItems && saleItems.length > 0) {
      const items = saleItems.map(item => ({
        saleId: sale.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      await SaleItem.bulkCreate(items, { transaction: t });
    }

    // ✅ commit transaction
    await t.commit();

    res.status(201).json({
      success: true,
      message: "Create sale successfully",
      sale
    });

  } catch (error) {
    // ❌ rollback if error
    await t.rollback();
    logError("createSale", error, res);
  }
};

const deleteSale = async (req, res) => {
    
}


module.exports = {
  getSale,
  createSale
};