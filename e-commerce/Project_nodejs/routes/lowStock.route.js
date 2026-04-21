const {LowStock, alertOfStock} = require("../controllers/LowStock.controller")

const RouteLowStock =(app)=>{
    app.get("/api/lowstock",LowStock);
    app.get("/api/outofstock",alertOfStock);
}

module.exports = RouteLowStock