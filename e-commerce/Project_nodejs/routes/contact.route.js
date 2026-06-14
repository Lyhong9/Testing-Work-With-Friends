const  {addContact} = require("../controllers/contact.controller");

const  ContactRoute = (app)=>{
    app.post("/api/contact", addContact);
}

module.exports = ContactRoute