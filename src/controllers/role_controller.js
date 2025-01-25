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

async function getPermissionsForRole(req, res) {
    try {
        const { roleId } = req.params;

        const permissions = await roleService.getPermissionsForRole(roleId);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Permissions fetched successfully',
            data: permissions,
        });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function removePermissionFromRole(req, res) {
    try {
        const { roleId, permissionId } = req.params;

        const response = await roleService.removePermissionFromRole(roleId, permissionId);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Permission removed from role successfully',
            data: response,
        });
    } catch (error) {
        console.log("RoleController: Something went wrong", error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function addPermissionsToRoleBulk(req, res) {
    try {
        const { roleId } = req.params;
        const { permissionIds } = req.body; // Expecting an array of permission IDs

        if (!Array.isArray(permissionIds)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'permissionIds must be an array of integers',
            });
        }

        const response = await roleService.addPermissionsToRoleBulk(roleId, permissionIds);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Permissions added to role successfully',
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
    addPermissionToRole,
    getPermissionsForRole,
    removePermissionFromRole,
    addPermissionsToRoleBulk
};
