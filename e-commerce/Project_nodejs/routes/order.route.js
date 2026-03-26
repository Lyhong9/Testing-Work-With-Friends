const {getOrder, createOrder, deleteOrder, updateOrder} = require("../controllers/order.controller");

const orderRoute = (app) =>{
    app.get('/api/order', getOrder);
    app.post('/api/order', createOrder);
    app.delete('/api/order/:id', deleteOrder);
    app.put('/api/order', updateOrder);
}

module.exports = orderRoute;