const {getPermission} = require("../controllers/permission.controller");

const PermissionRoute = (app) => {
    app.get("/api/permission", getPermission);
}

module.exports = PermissionRoute
