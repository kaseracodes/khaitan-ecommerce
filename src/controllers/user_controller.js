const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { UserService }  = require('../services/index');
const { UserRepository, CartRepository } = require('../repositories/index');

const errorResponse = require('../utils/error_response');
const { NODE_ENV } = require('../config/server_config');

const userService = new UserService(new UserRepository(), new CartRepository);

async function createUser(req, res) {

    try {
        
        const response = await userService.createUser(req.body);
    
        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " User",
                    data: response
        });

    } catch(error) {
        console.log("UserController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}


async function signin(req, res) {

    try {
        
        const response = await userService.signinUser(req.body);

        res.cookie('token', response, {
            httpOnly: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: NODE_ENV == 'production'
        });
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully signed in",
                    data: (NODE_ENV == 'production') ? true : response
        });

    } catch(error) {
        console.log("UserController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function updateUserDetails(req, res) {
    try {

        const response = await userService.updateUserDetails(req.user.id, req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " User",
                    data: response
        });

    } catch (error) {

        console.log("UserController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));

    }
}

async function forgotPassword(req, res) {
    try {

        const response = await userService.forgotPassword(req.params.id);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Forgot Password for User",
                    data: response
        });

    } catch(error) {

        console.log("UserController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));

    }
}

async function resetPassword(req, res) {
    try {

        const response = await userService.resetPassword(req.params.id, req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Reset Password for User",
                    data: response
        });

    } catch(error) {

        console.log("UserController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));

    }
}

async function verifyUserRole(req, res) {
    try {
        const response = await userService.verifyUserRole(req);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "User role verification updated successfully",
                data: response,
            });

    } catch (error) {
        console.log("UserController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}

async function getRoleUnverifiedUsers(req, res) {
    try {
        const response = await userService.getRoleUnverifiedUsers();
        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully fetched users whose roles are unverified",
            data: response,
        });
    } catch (error) {
        console.log("UserController: Error fetching unverified users", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}

async function getAdminUsers(req, res) {
    try {
        const admins = await userService.getAdminUsers();
        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully fetched all verified admins along with their roles",
            data: admins,
        });
    } catch (error) {
        console.log("UserController: Error fetching admin users", error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).
        json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}

async function getRegularUsers(req, res) {
    try {
        const users = await userService.getRegularUsers();
        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully fetched all regular users",
            data: users,
        });
    } catch (error) {
        console.log("UserController: Error fetching regular users", error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).
        json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}

async function changeUserRole(req, res) {
    try {
        const { roleId } = req.body;
        const { id } = req.params;

        const response = await userService.changeUserRole(id, roleId);

        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully updated user role",
            data: response,
        });
    } catch (error) {
        console.log("UserController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}


module.exports = {
    createUser,
    signin,
    updateUserDetails,
    forgotPassword,
    resetPassword,
    verifyUserRole,
    getRoleUnverifiedUsers,
    getAdminUsers,
    getRegularUsers,
    changeUserRole
}