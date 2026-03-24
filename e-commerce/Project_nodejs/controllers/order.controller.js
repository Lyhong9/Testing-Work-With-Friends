const { Order, OrderItem, sequelize, Product } = require("../models");
const { Op} = require("sequelize");
const { logError } = require("../middleware/logError");
const getOrder = async (req, res) => {
  try {
    const order = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Get all orders",
      order: order
    });
  } catch (error) {
    logError("getOrder", error, res);
  }
};

const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const {customerId, status, orderAmount, orderItems} = req.body;

        const order = await Order.create({
            customerID: customerId,
            status,
            orderAmount,
        }, {transaction});

        const items = orderItems.map(item => ({
            orderID: order.id,
            productID: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(items, {transaction});
        await transaction.commit();

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: order
        });

    }catch(error){
        logError("createOrder", error, res);
    }
};

module.exports = { getOrder, createOrder };