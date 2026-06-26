const  {addContact} = require("../controllers/contact.controller");
const  {validate_token} = require("../middleware/auth");
const  ContactRoute = (app)=>{
    app.post("/api/contact", validate_token(), addContact);
}

module.exports = ContactRoute