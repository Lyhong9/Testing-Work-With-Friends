const {LowStock, alertOfStock} = require("../controllers/LowStock.controller")
const { validate_token } = require("../middleware/auth");
const RouteLowStock =(app)=>{
    app.get("/api/lowstock", validate_token(), LowStock);
    app.get("/api/outofstock", validate_token(), alertOfStock);
}

module.exports = RouteLowStock