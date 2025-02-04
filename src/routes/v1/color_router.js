const express = require('express')

const { colorValidator, updateColorValidator } = require('../../middlewares/color_middleware');
const { createColor, updateColor, getAllColors, getColor, destroyColor } = require('../../controllers/color_controller');

const colorRouter = express.Router();

colorRouter.post('/', colorValidator, createColor);

colorRouter.patch('/:id', updateColorValidator, updateColor);
                        
colorRouter.get('/', getAllColors);
colorRouter.get('/:id', getColor);
colorRouter.delete('/:id', destroyColor);

                        
// GET /api/v1/Colors/:id -> 
// GET /api/v1/Colors -> all Colors

module.exports = colorRouter;