const {CreateUserRole, getUserRole,updateUserRole} = require("../controllers/userRole.controller")
const {validate_token} = require("../middleware/auth")
const userRoleRoute = (app) =>{
    app.post("/api/userRole", validate_token(), CreateUserRole)
    app.get("/api/userRole", validate_token(), getUserRole)
    app.put("/api/userRole", validate_token(), updateUserRole)
}

module.exports = userRoleRoute