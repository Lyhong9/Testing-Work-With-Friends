const {getInventory, createInventory,deleteInventory,updateInventory} = require("../controllers/inventory.controller");

const InventoryRoute = (app) => {
    app.get("/api/inventory", getInventory)
    app.post("/api/inventory", createInventory)
    app.put("/api/inventory/:id", updateInventory)
    app.delete("/api/inventory/:id", deleteInventory)
}

module.exports = InventoryRoute
