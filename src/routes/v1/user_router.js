const express = require('express');

const { UserController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');


const { createUser, signin, verifyUserRole, getRoleUnverifiedUsers, getAdminUsers, getRegularUsers }  = UserController;

const userRouter = express.Router();


userRouter.post('/signup', createUser); // mapping a route to a controller
userRouter.post('/signin', signin);
userRouter.patch('/:id/verify/role', isLoggedIn, verifyUserRole);
userRouter.get("/unverified/role", isLoggedIn, getRoleUnverifiedUsers);
userRouter.get("/admins", getAdminUsers);
userRouter.get("/regular", getRegularUsers);
   
module.exports = userRouter;