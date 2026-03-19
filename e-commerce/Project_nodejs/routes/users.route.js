const {getUsers, registerUser} = require("../controllers/users.controller")
const usersRoute = (app) =>{
    app.get("/api/user", getUsers);
    app.post("/api/user", registerUser);
}

module.exports = usersRoute