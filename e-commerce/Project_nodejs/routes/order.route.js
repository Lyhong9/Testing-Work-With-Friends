const {getOrder, createOrder} = require("../controllers/order.controller");

const orderRoute = (app) =>{
    app.get('/api/order', getOrder);
    app.post('/api/order', createOrder);
    
}

module.exports = orderRoute;