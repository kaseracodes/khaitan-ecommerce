const { accessControlCache } = require("../cache");
const ForbiddenError = require("../errors/forbidden_error");
const errorResponse = require('../utils/error_response');

const hasPermission = (requiredPermissionName) => {
    return async (req, res, next) => {
        try {
            // Check if the user's role has the required permission
            const hasPermission = await accessControlCache.hasPermission(req.user.roleId, requiredPermissionName);

            if (!hasPermission) {
                throw new ForbiddenError('', requiredPermissionName, 'User does not have the required permission');
            }

            next();
        } catch (error) {
            console.log("Access Control Middleware: Something went wrong", error);
            return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(errorResponse(error.reason, error));
        }
    };
};

module.exports = hasPermission;
