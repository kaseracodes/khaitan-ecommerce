const express = require('express');

const { UserController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');


const { createUser, signin, verifyUserRole }  = UserController;

const userRouter = express.Router();


userRouter.post('/signup', createUser); // mapping a route to a controller
userRouter.post('/signin', signin);
userRouter.patch('/:id/verify/role', isLoggedIn, verifyUserRole);
   
module.exports = userRouter;