const { Sale, SaleItem, sequelize, Product } = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");
const {alertNewSale} = require("../util/sentTelegram");

// ✅ GET ALL SALES WITH ITEMS
const getSale = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: SaleItem,
          as: "saleItems",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        }
      ],
    });

    res.status(200).json({
      success: true,
      message: "Get all sales",
      sales: sales
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
    // if (saleItems && saleItems.length > 0) {
      const items = saleItems.map(item => ({
        saleId: sale.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      await SaleItem.bulkCreate(items, { transaction: t });
    // }

    // ✅ send telegram message
    await alertNewSale(sale, items);
    // ✅ commit transaction
    await t.commit();
    
    res.status(201).json({
      success: true,
      message: "Create sale successfully",
      sale,
    });

  } catch (error) {
    // ❌ rollback if error
    await t.rollback();
    logError("createSale", error, res);
  }
};

const deleteSale = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    // Find the sale with its items
    const sale = await Sale.findByPk(id, {
      include: [{ model: SaleItem, as: 'saleItems' }],
      transaction,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    // Restore stock quantities
    for (const item of sale.saleItems) {
      await Product.increment('stockQuantity', {
        by: item.quantity,
        where: { id: item.productId },
        transaction,
      });
    }

    // Delete sale items
    await SaleItem.destroy({
      where: { saleId: id },
      transaction,
    });

    // Delete the sale
    await Sale.destroy({
      where: { id },
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully, stock restored',
    });
  } catch (error) {
    await transaction.rollback();
    logError('deleteSale', error, res);
  }
};

const updateProduct = async (req, res) => {
  try{
    const {id, quantity} = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({ stockQuantity: product.stockQuantity - quantity });
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  }catch(err){
    logError("updateProduct", err, res)
  }
}


module.exports = {
  getSale,
  createSale,
  deleteSale,
  updateProduct
};