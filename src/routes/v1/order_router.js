const express = require('express');

const { OrderController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');


const { createOrder, getOrdersDetailsForAllUsers, getOrdersDetailsForUser, getOrder, updateDeliveryStatus, verifyPayment }  = OrderController;

const orderRouter = express.Router();


orderRouter.post('/', isLoggedIn, createOrder); // mapping a route to a controller
orderRouter.get('/admin', isLoggedIn, getOrdersDetailsForAllUsers);
orderRouter.get('/user', isLoggedIn, getOrdersDetailsForUser);
orderRouter.post('/verify-payment', isLoggedIn, verifyPayment);
orderRouter.get('/:id', isLoggedIn, getOrder);
orderRouter.patch('/:id', isLoggedIn, updateDeliveryStatus);
module.exports = orderRouter;