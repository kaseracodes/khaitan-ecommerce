const express = require('express');

const { RoleController } = require('../../controllers/index');


const { getAllRoles, getRole, createRole, updateRole, destroyRole}  = RoleController;

const roleRouter = express.Router();


roleRouter.post('/', createRole); // mapping a route to a controller                
roleRouter.get('/', getAllRoles);
roleRouter.get('/:id', getRole);
roleRouter.delete('/:id', destroyRole);
roleRouter.patch('/:id', updateRole);


module.exports = roleRouter;