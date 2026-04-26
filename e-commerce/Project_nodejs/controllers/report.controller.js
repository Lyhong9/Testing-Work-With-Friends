const logError = require("../middleware/logError");
const { Op, fn, col, literal } = require("sequelize");
const {
  Product,
  Sale,
  SaleItem,
  Customer,
  Order,
  OrderItem,
  Brand,
  sequelize,
  Category,
  Payment,
} = require("../models");
const { stat } = require("node:fs");

// =============Dashbord Statistics =============
// get dashboard overiew stat
const getDashboardOverview = async (req, res) => {
  try {
    // get data rang (default to current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOflastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOflastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // total sales (current month from orders)
    const currentMonthOrders = await Order.findAll({
      where: {
        created_on: {
          [Op.gte]: startOfMonth,
        },
      },
    });
    const totalSales = currentMonthOrders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0,
    );

    // last  month sales for comparison (orders)
    const lastMonthOrders = await Order.findAll({
      where: {
        created_on: {
          [Op.gte]: startOflastMonth,
          [Op.lte]: endOflastMonth,
        },
      },
    });
    const lastMonthSales = lastMonthOrders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0,
    );

    // sales change percentage
    const salesChange =
      lastMonthSales > 0
        ? (((totalSales - lastMonthSales) / lastMonthSales) * 100).toFixed(2)
        : "0";

    // total transactions (orders count )
    const totalTransactions = currentMonthOrders.length;
    const lastMonthTransactions = lastMonthOrders.length;
    const transactionsChange =
      lastMonthTransactions > 0
        ? (
            ((totalTransactions - lastMonthTransactions) /
              lastMonthTransactions) *
            100
          ).toFixed(2)
        : "0";

    // total products
    const products = await Product.findAll();

    // inventory value (sum of stock quantity * price for all products)
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.stockQuantity * product.price,
      0,
    );

    // total customers
    const totalCustomers = await Customer.count();

    // total orders
    const pendingOrders = await Order.count();

    res.json({
      success: true,
      data: {
        totalSales: totalSales.toFixed(2),
        lastMonthSales,
        salesChange: parseFloat(salesChange),
        totalTransactions,
        lastMonthTransactions,
        transactionsChange: parseFloat(transactionsChange),
        inventoryValue: inventoryValue.toFixed(2),
        totalCustomers,
        totalProducts: products.length,
        pendingOrders,
      },
    });
  } catch (err) {
    logError("getDashboardOverview", err, res);
  }
};

// ============Sales Report =============
// get sale summary report (total sales, total transactions, average order value)
const getSalesSummary = async (req, res) => {
  try {
    const { period = "daily", startDate, endDate } = req.query; // expected values: 'daily', 'weekly', 'monthly'
    let dateFilter = {};

    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        created_on: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    } else {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = {
        created_on: {
          [Op.gte]: thirtyDaysAgo,
        },
      };
    }
    const orders = await Order.findAll({
      where: dateFilter,
      order: [["created_on", "ASC"]],
    });

    const groupdata = {};
    orders.forEach((order) => {
      let key;
      const data = new Date(order.created_on);

      if (period == "daily") {
        key = data.toISOString().split("T")[0];
      } else if (period == "weekly") {
        const weekStart = new Date(data);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        key = weekStart.toISOString().split("T")[0];
      } else if (period == "monthly") {
        key = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}`;
      }
      if (!groupdata[key]) {
        groupdata[key] = {
          date: key,
          sales: 0,
          transactions: 0,
        };
      }
      groupdata[key].sales += order.amount || 0;
      groupdata[key].transactions += 1;
    });

    const charData = Object.values(groupdata);
    res.json({
      success: true,
      data: charData,
      summary: {
        totalSales: orders
          .reduce((sum, order) => sum + (order.amount || 0), 0)
          .toFixed(2),
        totalTransactions: orders.length,
        averageOrderValue:
          orders.length > 0
            ? (
                orders.reduce((sum, order) => sum + (order.amount || 0), 0) /
                orders.length
              ).toFixed(2)
            : "0",
      },
    });
  } catch (err) {
    logError("getSalesSummary", err, res);
  }
};

// Get Sales by payment method
const getSalesByPaymentMethod = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      attributes: [
        "method",
        [sequelize.fn("SUM", sequelize.col("amount")), "total_amount"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total_orders"],
      ],
      group: ["method"],
    });

    res.json({
      success: true,
      data: payments.map((payment) => ({
        paymentMethod: payment.method,
        totalOrders: parseInt(payment.getDataValue("total_orders"), 10),
        totalAmount: parseFloat(payment.getDataValue("total_amount")).toFixed(
          2,
        ),
      })),
    });
  } catch (err) {
    logError("getSalesByPaymentMethod", err, res);
  }
};

// get Top Selling Product
const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await SaleItem.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalQuantity"],
      ],
      group: ["productId"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity")), "DESC"]],
      limit: 10,
    });

    res.json({
      success: true,
      data: topProducts.map((product) => ({
        productId: product.productId,
        totalQuantity: product.getDataValue("totalQuantity"),
      })),
    });
  } catch (err) {
    logError("getTopSellingProducts", err, res);
  }
};

/// Get  products by category
const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "stockQuantity"],
        },
      ],
    });

    const data = category.map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      products: cat.products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
      })),
    }));
    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    logError("getProductsByCategory", err, res);
  }
};




module.exports = {
  getDashboardOverview,
  getSalesSummary,
  getSalesByPaymentMethod,
  getTopSellingProducts,
  getProductsByCategory,
};
