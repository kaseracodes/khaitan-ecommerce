const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { RoleService } = require('../services/index');
const { RoleRepository } = require('../repositories/index');

const errorResponse = require('../utils/error_response');

const roleService = new RoleService(new RoleRepository());

async function createRole(req, res) {
    try {
        const response = await roleService.createRole(req.body);

        return res
            .status(StatusCodes.CREATED)
            .json({
                success: true,
                error: {},
                message: ReasonPhrases.CREATED + " Role",
                data: response,
            });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function getAllRoles(req, res) {
    try {
        const response = await roleService.getAllRoles();

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully fetched Roles",
                data: response,
            });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function getRole(req, res) {
    try {
        const response = await roleService.getRole(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully fetched Role",
                data: response,
            });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function updateRole(req, res) {
    try {
        const response = await roleService.updateRole(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully updated Role",
                data: response,
            });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyRole(req, res) {
    try {
        const response = await roleService.destroyRole(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
                success: true,
                error: {},
                message: "Successfully deleted Role",
                data: response,
            });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function addPermissionToRole(req, res) {
    try {
        const { roleId } = req.params;
        const { permissionId } = req.body;  

        const response = await roleService.addPermissionToRole(roleId, permissionId);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Permission added to role successfully',
            data: response,
        });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

module.exports = {
    createRole,
    getAllRoles,
    getRole,
    updateRole,
    destroyRole,
    addPermissionToRole
};
