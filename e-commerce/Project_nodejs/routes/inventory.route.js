const {getInventory, createInventory,deleteInventory,updateInventory,subtractQuantity} = require("../controllers/inventory.controller");
const {validate_token} = require("../middleware/auth");
const InventoryRoute = (app) => {
    app.get("/api/inventory", validate_token(), getInventory)
    app.post("/api/inventory", validate_token(), createInventory)
    app.put("/api/inventory/:id", validate_token(), updateInventory)
    app.delete("/api/inventory/:id", validate_token(), deleteInventory)
    app.post("/api/inventory/quantity",subtractQuantity)
}

module.exports = InventoryRoute
