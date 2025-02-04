const express = require('express')

const { attributeValidator } = require('../../middlewares/attribute_middleware');
const { createAttribute, updateAttribute, getAllAttributes, getAttribute, destroyAttribute } = require('../../controllers/attribute_controller');

const attributeRouter = express.Router();

attributeRouter.post('/',
                    attributeValidator,
                    createAttribute);

attributeRouter.patch('/:id', updateAttribute);
                        
attributeRouter.get('/', getAllAttributes);
attributeRouter.get('/:id', getAttribute);
attributeRouter.delete('/:id', destroyAttribute);

                        
// GET /api/v1/attributes/:id -> 
// GET /api/v1/attributes -> all attributes

module.exports = attributeRouter;