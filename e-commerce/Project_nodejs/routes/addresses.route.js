const  {
    createAddresses, 
    deleteAddresses,
    getAddresses,
    updateAddresses,
    getOneAddress
} = require("../controllers/addresses.controller");


const addressesRoute = (app) => {
    app.post("/api/addresses", createAddresses);
    app.get("/api/addresses", getAddresses);
    app.get("/api/addresses/:id", getOneAddress);
    app.put("/api/addresses/:id", updateAddresses);
    app.delete("/api/addresses/:id", deleteAddresses);
}

module.exports = addressesRoute