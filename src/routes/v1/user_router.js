const express = require('express');

const { UserController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');


const { createUser, signin, updateUserDetails, forgotPassword, resetPassword, verifyUserRole, verifyUserOTP, resendUserOTP, getRoleUnverifiedUsers, getAdminUsers, getRegularUsers, changeUserRole, getUserProfile }  = UserController;


const userRouter = express.Router();


userRouter.post('/signup', createUser); // mapping a route to a controller
userRouter.post('/signin', signin);
userRouter.patch('/', isLoggedIn, updateUserDetails);
userRouter.post('/:id/forgot-password', forgotPassword);
userRouter.patch('/:id/reset-password', resetPassword);
userRouter.patch('/:id/verify/role', isLoggedIn, verifyUserRole);
userRouter.patch('/:id/verify/otp', verifyUserOTP);
userRouter.post('/:id/resend-otp', resendUserOTP);
userRouter.get("/unverified/role", isLoggedIn, getRoleUnverifiedUsers);
userRouter.get("/admins", getAdminUsers);
userRouter.get("/regular", getRegularUsers);
userRouter.patch('/:id/role', changeUserRole);
userRouter.get('/profile', isLoggedIn, getUserProfile);
   
module.exports = userRouter;