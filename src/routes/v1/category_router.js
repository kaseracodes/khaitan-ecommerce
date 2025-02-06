const express = require('express');

const { CategoryController } = require('../../controllers/index');


const { createCategory, getAllCategories, getCategory, updateCategory, destroyCategory, getProductsForCategory, getAttributesForCategory, getAllProductsWithAttributesForCategory, getAllProductsWithAttributesAndMediaForCategory }  = CategoryController;
const { categoryValidator, updateCategoryValidator } = require('../../middlewares/category_middleware');

const categoryRouter = express.Router();


categoryRouter.post('/', 
                categoryValidator, 
                createCategory); // mapping a route to a controller

categoryRouter.patch('/:id', updateCategoryValidator, updateCategory);
                
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id/products/attributes/media', getAllProductsWithAttributesAndMediaForCategory);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/:id', destroyCategory);
categoryRouter.get('/:id/products', getProductsForCategory);
categoryRouter.get('/:id/attributes', getAttributesForCategory);
categoryRouter.get('/:id/products/attributes', getAllProductsWithAttributesForCategory);


// GET /api/v1/categories/:id -> 
// GET /api/v1/categories -> all categories

module.exports = categoryRouter;