const express = require('express');

const { PermissionController } = require('../../controllers/index');

const { createPermission, getAllPermissions, getPermission, destroyPermission  }  = PermissionController;

const permissionRouter = express.Router();


permissionRouter.post('/', createPermission); // mapping a route to a controller
permissionRouter.get('/', getAllPermissions);
permissionRouter.get('/:id', getPermission);
permissionRouter.delete('/:id', destroyPermission);


module.exports = permissionRouter;