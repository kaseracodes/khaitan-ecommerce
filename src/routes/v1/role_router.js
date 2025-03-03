const express = require('express');

const { RoleController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');


const { getAllRoles, 
        getRole, 
        createRole, 
        updateRole, 
        destroyRole, 
        addPermissionToRole, 
        getPermissionsForRole, 
        removePermissionFromRole, 
        addPermissionsToRoleBulk, 
        getAllRolePermissions }  = RoleController;
const { validateBulkPermissions } = require('../../middlewares/role_middlewares');

const roleRouter = express.Router();


roleRouter.post('/', isLoggedIn, hasPermission('role:create'), createRole); // mapping a route to a controller                
roleRouter.get('/', getAllRoles);
roleRouter.get('/permissions', isLoggedIn, hasPermission('role:read_all_permission'), getAllRolePermissions); //This route should be declared before /roles/:id for proper routing
roleRouter.get('/:id', getRole);
roleRouter.delete('/:id', isLoggedIn, hasPermission('role:delete_permission'), destroyRole);
roleRouter.patch('/:id', isLoggedIn, hasPermission('role:update'), updateRole);
roleRouter.post('/:roleId/permissions', isLoggedIn, hasPermission('role:create_permission'), addPermissionToRole);
roleRouter.get('/:roleId/permissions', isLoggedIn, getPermissionsForRole);
roleRouter.delete('/:roleId/permissions/:permissionId', isLoggedIn, hasPermission('role:delete_permission'), removePermissionFromRole);
roleRouter.post('/:roleId/permissions/bulk', isLoggedIn, hasPermission('role:bulk_create_permission'), validateBulkPermissions, addPermissionsToRoleBulk);



module.exports = roleRouter;