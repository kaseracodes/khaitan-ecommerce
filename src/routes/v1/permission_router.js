const express = require('express');

const { PermissionController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createPermission, getAllPermissions, getPermission, destroyPermission  }  = PermissionController;

const permissionRouter = express.Router();


permissionRouter.post('/', isLoggedIn, hasPermission('permission:create'), createPermission); // mapping a route to a controller
permissionRouter.get('/', isLoggedIn, getAllPermissions);
permissionRouter.get('/:id', isLoggedIn, getPermission);
permissionRouter.delete('/:id', isLoggedIn, hasPermission('permission:delete'), destroyPermission);


module.exports = permissionRouter;