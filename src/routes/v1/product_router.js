const express = require('express');

const { ProductController } = require('../../controllers/index');

const { createProduct, getProducts, getProduct, destroyProduct, addAttributeToProduct, getAllAttributesForProduct, updateAttributeForProduct, bulkAddAttributesToProduct, getAllProductsWithAttributes, getAllProductsWithAttributesAndMedia, getProductWithAttributesAndMedia, updateBasicInfoForProduct } = ProductController;
const { createProductValidator, updateAttributeForProductValidator, bulkAddAttributesValidator, updateBasicInfoForProductValidator } = require('../../middlewares/product_middlewares');
const { productAttributeValidator } = require('../../middlewares/product_attribute_middleware');

const productRouter = express.Router();


productRouter.post('/', createProductValidator, createProduct); // mapping a route to a controller
productRouter.get('/attributes/media', getAllProductsWithAttributesAndMedia);
productRouter.get('/:id/attributes/media', getProductWithAttributesAndMedia);
productRouter.get('/attributes', getAllProductsWithAttributes);
productRouter.get('/', getProducts); // mapping a route to a controller
productRouter.get('/:id', getProduct);
productRouter.delete('/:id', destroyProduct);
productRouter.post('/:id/attributes', productAttributeValidator, addAttributeToProduct);
productRouter.post('/:id/attributes/bulk', bulkAddAttributesValidator, bulkAddAttributesToProduct);
productRouter.get('/:id/attributes', getAllAttributesForProduct);
productRouter.patch('/:productId/attributes/:attributeId', updateAttributeForProductValidator, updateAttributeForProduct);
productRouter.patch('/:id', updateBasicInfoForProductValidator, updateBasicInfoForProduct);
module.exports = productRouter;