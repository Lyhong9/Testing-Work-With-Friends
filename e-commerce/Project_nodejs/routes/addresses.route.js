const  {
    createAddresses, 
    deleteAddresses,
    getAddresses,
    updateAddresses,
    getOneAddress
} = require("../controllers/addresses.controller");

const { validate_token } = require("../middleware/auth");
const addressesRoute = (app) => {
    app.post("/api/addresses", validate_token(), createAddresses);
    app.get("/api/addresses", validate_token(), getAddresses);
    app.get("/api/addresses/:id", validate_token(), getOneAddress);
    app.put("/api/addresses/:id", validate_token(), updateAddresses);
    app.delete("/api/addresses/:id", validate_token(), deleteAddresses);
}

module.exports = addressesRoute