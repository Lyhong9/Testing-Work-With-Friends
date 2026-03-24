const {Payment, Order, Sale} = require('../models');
const {logError} = require("../middleware/logError");
const {Op} = require("sequelize");

const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findAll({
            include: [
                {
                    model: Order,
                    as: "order",
                    attributes: ["id", "orderAmount", "status", "orderDate", "customerID",],
                },
            ],
            include: [
                {
                    model: Sale,
                    as: "sale",
                    attributes: ["id", "totalAmount", "tax", "userId", "paymentMethod",],
                },
            ],
        });
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        });
    } catch (error) {
        logError(error);
        res.status(500).json({ message: 'Error creating payment' });
    }
};

const createPayment = async (req, res) =>{
    try{
        const {saleId, orderId, amount, method, status} = req.body;
        if(!amount){
            return res.status(400).json({
                message: "amount is required",
                success: false
            });
        }
        if(!method){
            return res.status(400).json({
                message: "method is required",
                success: false
            });
        }
        if(!status){
            return res.status(400).json({
                message: "status is required",
                success: false
            });
        }

        const payment = await Payment.create({saleId, orderId, amount, method, status});
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        });
    }catch(error){
        logError("createPayment", error, res);
    }
}


module.exports = {getPayment, createPayment};