const {getRole,createRole, deleteRole,updateRole, AddMorePermission} = require("../controllers/role.controller");
const { validate_token } = require("../middleware/auth");
const roleRoute = (app) =>{
    app.get('/api/role', validate_token(),  getRole);
    app.post('/api/role', validate_token(), createRole);
    app.put('/api/role', validate_token(), updateRole);
    app.delete('/api/role/:id', validate_token(), deleteRole);
    app.post('/api/role/addMorePermission', validate_token(), AddMorePermission);
}
module.exports = roleRoute
 