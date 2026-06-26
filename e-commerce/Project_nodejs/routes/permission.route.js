const {getPermission, createPermission, updatePermission, deletePermission} = require("../controllers/permission.controller");
const  { validate_token } = require('../middleware/auth');
const PermissionRoute = (app) => {
    app.get("/api/permission",  validate_token(), getPermission);
    app.post("/api/permission",  validate_token(), createPermission);
    app.put("/api/permission/:id",  validate_token(), updatePermission);
    app.delete("/api/permission/:id",  validate_token(), deletePermission);
}

module.exports = PermissionRoute
