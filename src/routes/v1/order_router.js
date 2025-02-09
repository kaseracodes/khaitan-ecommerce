const express = require('express');

const { OrderController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');


const { createOrder, getOrdersDetailsForAllUsers, getOrdersDetailsForUser, getOrder }  = OrderController;

const orderRouter = express.Router();


orderRouter.post('/', isLoggedIn, createOrder); // mapping a route to a controller
orderRouter.get('/admin', isLoggedIn, getOrdersDetailsForAllUsers);
orderRouter.get('/user', isLoggedIn, getOrdersDetailsForUser);
orderRouter.get('/:id', isLoggedIn, getOrder);
module.exports = orderRouter;