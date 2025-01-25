const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function validateBulkPermissions(req, res, next) {
    const { permissionIds } = req.body;

    if (!permissionIds) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                errorResponse(
                    ReasonPhrases.BAD_REQUEST,
                    new BadRequest('permissionIds')
                )
            );
    }

    if (!Array.isArray(permissionIds)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                errorResponse(
                    ReasonPhrases.BAD_REQUEST,
                    new BadRequest('permissionIds', 'permissionIds', 'Must be an array')
                )
            );
    }

    if (permissionIds.length === 0) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                errorResponse(
                    ReasonPhrases.BAD_REQUEST,
                    new BadRequest('permissionIds', 'permissionIds', 'Cannot be an empty array')
                )
            );
    }

    // If everything is valid, proceed to the next middleware/controller
    next();
}

module.exports = {
    validateBulkPermissions,
};
