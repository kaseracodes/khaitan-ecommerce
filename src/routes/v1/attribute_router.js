const express = require('express')

const { attributeValidator } = require('../../middlewares/attribute_middleware');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createAttribute, updateAttribute, getAllAttributes, getAttribute, destroyAttribute } = require('../../controllers/attribute_controller');

const attributeRouter = express.Router();

attributeRouter.post('/',
                    isLoggedIn,
                    hasPermission('attribute:create'),
                    attributeValidator,
                    createAttribute);

attributeRouter.patch('/:id', isLoggedIn, hasPermission('attribute:update'), updateAttribute);
                        
attributeRouter.get('/', getAllAttributes);
attributeRouter.get('/:id', getAttribute);
attributeRouter.delete('/:id', isLoggedIn, hasPermission('attribute:delete'), destroyAttribute);

                        
// GET /api/v1/attributes/:id -> 
// GET /api/v1/attributes -> all attributes

module.exports = attributeRouter;