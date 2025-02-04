const express = require('express');

const v1Router = express.Router();

const pingRouter = require('./ping_router');
const productsRouter = require('./product_router');
const categoryRouter = require('./category_router');
const userRouter = require('./user_router');
const cartRouter = require('./cart_router');
const orderRouter = require('./order_router');
const attributeRouter = require('./attribute_router');
const colorRouter = require('./color_router');
const mediaRouter = require('./media_router');
const permissionRouter = require('./permission_router');
const roleRouter = require('./role_router');
// Any new api if we have to introduce we should just register it here if it is
// a V1 api

v1Router.use('/ping', pingRouter);
v1Router.use('/products', productsRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use('/users', userRouter);
v1Router.use('/carts', cartRouter);
v1Router.use('/orders', orderRouter);
v1Router.use('/attributes', attributeRouter);
v1Router.use('/colors', colorRouter);
v1Router.use('/media', mediaRouter);
v1Router.use('/permissions', permissionRouter);
v1Router.use('/roles', roleRouter);

module.exports = v1Router;