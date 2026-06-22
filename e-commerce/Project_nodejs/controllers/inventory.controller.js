const { Inventory, InventoryTransaction, sequelize } = require("../models");
const { Op } = require("sequelize");
const { logError } = require("../middleware/logError");
const { Where } = require("sequelize/lib/utils");

// GET /inventory?search=towel
const getInventory = async (req, res) => {
  try {
    const { search } = req.query;

    let where = {};

    if (search) {
      where = {
        [Op.or]: [
          {
            item_name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            supplier: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      };
    }

    const inventory = await Inventory.findAll({
      where,
      include: [
        {
          model: InventoryTransaction,
          as: "inventoryTransactions",
        },
      ],order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      message: "Inventory fetched successfully",
      inventory,
    });
  } catch (err) {
    logError("getInventory", err, res);
  }
};

const validateInventory = (
  product_id,
  item_name,
  quantity,
  supplier,
  unit_price,
) => {
  if (!product_id) return "Product id is required";
  if (!item_name) return "Item name is required";
  if (quantity === undefined || quantity === null)
    return "Quantity is required";
  if (!supplier) return "Supplier is required";
  if (!unit_price) return "Unit price is required";

  return null;
};

// POST /inventory
const createInventory = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      product_id,
      item_name,
      quantity,
      supplier,
      unit_price,
      transaction_type,
      transaction_date,
    } = req.body;

    const error = validateInventory(
      product_id,
      item_name,
      quantity,
      supplier,
      unit_price,
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const inventory = await Inventory.create(
      {
        productId: product_id,
        item_name,
        quantity,
        supplier,
        unit_price,
      },
      {
        transaction: t,
      },
    );

    const inventoryTransaction = await InventoryTransaction.create(
      {
        inventory_id: inventory.id,
        transaction_type,
        quantity,
        transaction_date: transaction_date || new Date(),
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      inventory,
      inventoryTransaction,
    });
  } catch (err) {
    await t.rollback();
    logError("createInventory", err, res);
  }
};

// PUT /inventory/:id
const updateInventory = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      product_id,
      item_name,
      supplier,
      unit_price,
      transaction_type,
      transaction_date,
      transaction_quantity,
    } = req.body;

    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    let newQuantity = inventory.quantity;

    if (transaction_type === "Out") {
      if (inventory.quantity < transaction_quantity) {
        return res.status(400).json({
          success: false,
          message: "Inventory quantity is not enough",
        });
      }

      newQuantity -= Number(transaction_quantity);
    }

    if (transaction_type === "In") {
      newQuantity += Number(transaction_quantity);
    }

    await inventory.update(
      {
        product_id,
        item_name,
        quantity: newQuantity,
        supplier,
        unit_price,
      },{Where: {id: id}},
      {
        transaction: t,
      }
    );

    const inventoryTransaction = await InventoryTransaction.create(
      {
        inventory_id: id,
        transaction_type,
        quantity: transaction_quantity,
        transaction_date: transaction_date || new Date(),
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    return res.json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
      inventoryTransaction,
    });
  } catch (err) {
    await t.rollback();
    logError("updateInventory", err, res);
  }
};

// DELETE /inventory/:id
const deleteInventory = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Inventory id is required",
      });
    }

    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found",
      });
    }

    await InventoryTransaction.destroy({
      where: {
        inventory_id: id,
      },
      transaction: t,
    });

    await Inventory.destroy({
      where: {
        id,
      },
      transaction: t,
    });

    await t.commit();

    return res.json({
      success: true,
      message: "Inventory deleted successfully",
    });
  } catch (err) {
    await t.rollback();
    logError("deleteInventory", err, res);
  }
};

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
