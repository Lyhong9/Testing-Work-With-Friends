const {getPermission, createPermission, updatePermission, deletePermission} = require("../controllers/permission.controller");

const PermissionRoute = (app) => {
    app.get("/api/permission", getPermission);
    app.post("/api/permission", createPermission);
    app.put("/api/permission/:id", updatePermission);
    app.delete("/api/permission/:id", deletePermission);
}

module.exports = PermissionRoute
