const {getSale, createSale, updateProduct, deleteSale} = require("../controllers/sales.controller")

const saleRoute = (app) =>{
    app.get("/api/sale", getSale);
    app.post("/api/sale", createSale);
    app.delete("/api/sale/:id", deleteSale);
     app.put("/api/sale/quantity", updateProduct);
}

module.exports = saleRoute