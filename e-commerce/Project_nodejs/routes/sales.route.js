const {getSale, createSale, updateProduct, deleteSale} = require("../controllers/sales.controller")
const {validate_token} = require("../middleware/auth")
const saleRoute = (app) =>{
    app.get("/api/sale", validate_token(), getSale);
    app.post("/api/sale", validate_token(), createSale);
    app.delete("/api/sale/:id", validate_token(), deleteSale);
     app.put("/api/sale/quantity", validate_token(), updateProduct);
}

module.exports = saleRoute