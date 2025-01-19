const express = require('express');

const { CategoryController } = require('../../controllers/index');


const { createCategory, getAllCategories, getCategory, updateCategory, destroyCategory, getProductsForCategory }  = CategoryController;
const { CategoryValidator } = require('../../middlewares/category_middleware');

const categoryRouter = express.Router();


categoryRouter.post('/', 
                CategoryValidator, 
                createCategory); // mapping a route to a controller

categoryRouter.put('/:id', 
                CategoryValidator,
                updateCategory);
                
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/:id', destroyCategory);
categoryRouter.get('/:id/products', getProductsForCategory);


// GET /api/v1/categories/:id -> 
// GET /api/v1/categories -> all categories

module.exports = categoryRouter;