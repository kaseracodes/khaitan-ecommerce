const express = require('express');

const { RoleController } = require('../../controllers/index');


const { getAllRoles, getRole, createRole, updateRole, destroyRole, addPermissionToRole, getPermissionsForRole, removePermissionFromRole, addPermissionsToRoleBulk}  = RoleController;
const { validateBulkPermissions } = require('../../middlewares/role_middlewares');

const roleRouter = express.Router();


roleRouter.post('/', createRole); // mapping a route to a controller                
roleRouter.get('/', getAllRoles);
roleRouter.get('/:id', getRole);
roleRouter.delete('/:id', destroyRole);
roleRouter.patch('/:id', updateRole);
roleRouter.post('/:roleId/permissions', addPermissionToRole);
roleRouter.get('/:roleId/permissions', getPermissionsForRole);
roleRouter.delete('/:roleId/permissions/:permissionId', removePermissionFromRole);
roleRouter.post('/:roleId/permissions/bulk', validateBulkPermissions, addPermissionsToRoleBulk);



module.exports = roleRouter;