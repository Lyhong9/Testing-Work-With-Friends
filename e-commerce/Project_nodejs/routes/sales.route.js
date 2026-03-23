const {getSale, createSale} = require("../controllers/sales.controller")

const saleRoute = (app) =>{
    app.get("/api/sale", getSale);
    app.post("/api/sale", createSale);
}

module.exports = saleRoute