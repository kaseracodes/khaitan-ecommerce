const express = require('express');

const { CategoryController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createCategory, getAllCategories, getCategory, updateCategory, destroyCategory, getProductsForCategory, getAttributesForCategory, getAllProductsWithAttributesForCategory, getAllProductsWithAttributesAndMediaForCategory }  = CategoryController;
const { categoryValidator, updateCategoryValidator } = require('../../middlewares/category_middleware');

const categoryRouter = express.Router();


categoryRouter.post('/', 
                isLoggedIn,
                hasPermission('category:create'),
                categoryValidator, 
                createCategory); // mapping a route to a controller

categoryRouter.patch('/:id', isLoggedIn, hasPermission('category:update'), updateCategoryValidator, updateCategory);
                
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id/products/attributes/media', getAllProductsWithAttributesAndMediaForCategory);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/:id', isLoggedIn, hasPermission('category:delete'), destroyCategory);
categoryRouter.get('/:id/products', getProductsForCategory);
categoryRouter.get('/:id/attributes', getAttributesForCategory);
categoryRouter.get('/:id/products/attributes', getAllProductsWithAttributesForCategory);


// GET /api/v1/categories/:id -> 
// GET /api/v1/categories -> all categories

module.exports = categoryRouter;