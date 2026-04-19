const {getRole,createRole, deleteRole,updateRole, AddMorePermission} = require("../controllers/role.controller");
const roleRoute = (app) =>{
    app.get('/api/role' , getRole);
    app.post('/api/role' , createRole);
    app.put('/api/role' , updateRole);
    app.delete('/api/role/:id' , deleteRole);
    app.post('/api/role/addMorePermission' , AddMorePermission);
}
module.exports = roleRoute
 