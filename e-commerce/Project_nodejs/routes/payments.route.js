const {getPayment, createPayment} = require("../controllers/payments.controller");
const {validate_token} = require("../middleware/auth");

const paymentRoute = (app) => {
    app.get('/api/payment', validate_token(), getPayment);
    app.post('/api/payment', createPayment);
};

module.exports = paymentRoute;