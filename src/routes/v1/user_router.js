const express = require('express');

const { UserController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createUser, signin, updateUserDetails, forgotPassword, resetPassword, verifyUserRole, verifyUserOTP, resendUserOTP, getRoleUnverifiedUsers, getAdminUsers, getRegularUsers, changeUserRole, getUserProfile }  = UserController;


const userRouter = express.Router();


userRouter.post('/signup', createUser); // mapping a route to a controller
userRouter.post('/signin', signin);
userRouter.patch('/', isLoggedIn, updateUserDetails);
userRouter.post('/:id/forgot-password', forgotPassword);
userRouter.patch('/:id/reset-password', resetPassword);
userRouter.patch('/:id/verify/role', isLoggedIn, hasPermission('user:verify_role'), verifyUserRole);
userRouter.patch('/:id/verify/otp', verifyUserOTP);
userRouter.post('/:id/resend-otp', resendUserOTP);
userRouter.get("/unverified/role", isLoggedIn, hasPermission('user:read_all_role_unverified'), getRoleUnverifiedUsers);
userRouter.get("/admins", isLoggedIn, hasPermission('user:read_all_admin'), getAdminUsers);
userRouter.get("/regular", isLoggedIn, hasPermission('user:read_all_regular'), getRegularUsers);
userRouter.patch('/:id/role', isLoggedIn, hasPermission('user:update_role'), changeUserRole);
userRouter.get('/profile', isLoggedIn, getUserProfile);
   
module.exports = userRouter;