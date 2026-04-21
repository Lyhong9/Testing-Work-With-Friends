const {LowStock} = require("../controllers/LowStock.controller")

const RouteLowStock =(app)=>{
    app.post("/api/lowstock",LowStock);
}

module.exports = RouteLowStock