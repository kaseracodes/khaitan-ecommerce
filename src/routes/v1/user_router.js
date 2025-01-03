const express = require('express');

const { UserController } = require('../../controllers/index');


const { createUser, signin, getAllUsers }  = UserController;

const userRouter = express.Router();


userRouter.post('/signup', createUser); // mapping a route to a controller
userRouter.post('/signin', signin);
userRouter.get('/', getAllUsers)
   
module.exports = userRouter;