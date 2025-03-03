const express = require('express')

const { colorValidator, updateColorValidator } = require('../../middlewares/color_middleware');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createColor, updateColor, getAllColors, getColor, destroyColor } = require('../../controllers/color_controller');

const colorRouter = express.Router();

colorRouter.post('/', isLoggedIn, hasPermission('color:create'), colorValidator, createColor);

colorRouter.patch('/:id', isLoggedIn, hasPermission('color:update'), updateColorValidator, updateColor);
                        
colorRouter.get('/', getAllColors);
colorRouter.get('/:id', getColor);
colorRouter.delete('/:id', isLoggedIn, hasPermission('color:delete'), destroyColor);

                        
// GET /api/v1/Colors/:id -> 
// GET /api/v1/Colors -> all Colors

module.exports = colorRouter;