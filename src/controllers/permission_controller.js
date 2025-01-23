const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { PermissionService } = require('../services/index');
const { PermissionRepository } = require('../repositories/index');

const errorResponse = require('../utils/error_response');

const permissionService = new PermissionService(new PermissionRepository());

async function createPermission(req, res) {
    try {
        const response = await permissionService.createPermission(req.body);

        return res
            .status(StatusCodes.CREATED)
            .json({
                success: true,
                error: {},
                message: ReasonPhrases.CREATED + " Permission",
                data: response
            });
    } catch (error) {
        console.log("PermissionController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function getAllPermissions(req, res) {
    try {
        const response = await permissionService.getAllPermissions();

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully fetched Permissions",
                data: response
            });
    } catch (error) {
        console.log("PermissionController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function getPermission(req, res) {
    try {
        const response = await permissionService.getPermission(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully fetched Permission",
                data: response
            });
    } catch (error) {
        console.log("PermissionController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyPermission(req, res) {
    try {
        const response = await permissionService.destroyPermission(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully deleted Permission",
                data: response
            });
    } catch (error) {
        console.log("PermissionController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

module.exports = {
    createPermission,
    getAllPermissions,
    getPermission,
    destroyPermission
};
