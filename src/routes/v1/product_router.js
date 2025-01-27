const express = require('express');

const { ProductController } = require('../../controllers/index');

const { createProduct, getProducts, getProduct, destroyProduct, addAttributeToProduct, getAllAttributesForProduct, updateAttributeForProduct } = ProductController;
const { createProductValidator, updateAttributeForProductValidator } = require('../../middlewares/product_middlewares');
const { productAttributeValidator } = require('../../middlewares/product_attribute_middleware');

const productRouter = express.Router();


productRouter.post('/', createProductValidator, createProduct); // mapping a route to a controller
productRouter.get('/', getProducts); // mapping a route to a controller
productRouter.get('/:id', getProduct);
productRouter.delete('/:id', destroyProduct);
productRouter.post('/:id/attributes', productAttributeValidator, addAttributeToProduct);
productRouter.get('/:id/attributes', getAllAttributesForProduct);
productRouter.patch('/:productId/attributes/:attributeId', updateAttributeForProductValidator, updateAttributeForProduct);
module.exports = productRouter;