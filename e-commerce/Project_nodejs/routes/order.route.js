const {getOrder, createOrder, deleteOrder, updateOrder} = require("../controllers/order.controller");
const {validate_token} = require("../middleware/auth");
const orderRoute = (app) =>{
    app.get('/api/order',  validate_token(), getOrder);
    app.post('/api/order',  validate_token(), createOrder);
    app.delete('/api/order/:id',  validate_token(), deleteOrder);
    app.put('/api/order',  validate_token(), updateOrder);
}

module.exports = orderRoute;