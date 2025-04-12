const express = require('express');

const { ProductController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createProduct, getProducts, getProduct, destroyProduct, addAttributeToProduct, getAllAttributesForProduct, updateAttributeForProduct, bulkAddAttributesToProduct, getAllProductsWithAttributes, getAllProductsWithAttributesAndMedia, getProductWithAttributesAndMedia } = ProductController;
const { createProductValidator, updateAttributeForProductValidator, bulkAddAttributesValidator } = require('../../middlewares/product_middlewares');
const { productAttributeValidator } = require('../../middlewares/product_attribute_middleware');

const productRouter = express.Router();


productRouter.post('/', isLoggedIn, hasPermission('product:create'), createProductValidator, createProduct); // mapping a route to a controller
productRouter.get('/attributes/media', getAllProductsWithAttributesAndMedia);
productRouter.get('/:id/attributes/media', getProductWithAttributesAndMedia);
productRouter.get('/attributes', getAllProductsWithAttributes);
productRouter.get('/', getProducts); // mapping a route to a controller
productRouter.get('/:id', getProduct);
productRouter.delete('/:id', isLoggedIn, hasPermission('product:delete'), destroyProduct);
productRouter.post('/:id/attributes', isLoggedIn, hasPermission('product:create_attribute'), productAttributeValidator, addAttributeToProduct);
productRouter.post('/:id/attributes/bulk', isLoggedIn, hasPermission('product:bulk_create_attribute'), bulkAddAttributesValidator, bulkAddAttributesToProduct);
productRouter.get('/:id/attributes', getAllAttributesForProduct);
productRouter.patch('/:productId/attributes/:attributeId', isLoggedIn, hasPermission('product:update_attribute'), updateAttributeForProductValidator, updateAttributeForProduct);
module.exports = productRouter;