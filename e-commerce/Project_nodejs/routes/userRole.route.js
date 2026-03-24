const {CreateUserRole, getUserRole,updateUserRole} = require("../controllers/userRole.controller")

const userRoleRoute = (app) =>{
    app.post("/api/userRole", CreateUserRole)
    app.get("/api/userRole", getUserRole)
    app.put("/api/userRole", updateUserRole)
}

module.exports = userRoleRoute