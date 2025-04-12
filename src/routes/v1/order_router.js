const express = require('express');

const { OrderController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createOrder, getOrdersDetailsForAllUsers, getOrdersDetailsForUser, getOrder, updateDeliveryStatus, verifyPayment }  = OrderController;

const orderRouter = express.Router();


orderRouter.post('/', isLoggedIn, createOrder); // mapping a route to a controller
orderRouter.get('/admin', isLoggedIn, hasPermission('order:read_admin'), getOrdersDetailsForAllUsers);
orderRouter.get('/user', isLoggedIn, getOrdersDetailsForUser);
orderRouter.post('/verify-payment', isLoggedIn, verifyPayment);
orderRouter.get('/:id', isLoggedIn, getOrder);
orderRouter.patch('/:id', isLoggedIn, hasPermission('order:update_delivery_status'), updateDeliveryStatus);
module.exports = orderRouter;