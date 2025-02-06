const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class ForbiddenError extends Error {
    constructor(resourceName, action, reason) {
        const errorMessage = `Forbidden to: ${action} : ${resourceName}. Reason: ${reason}`;
        super(errorMessage);
        this.statusCode = StatusCodes.FORBIDDEN;
        this.reason = ReasonPhrases.FORBIDDEN;
        this.errorMessage = errorMessage;
        this.name = "ForbiddenError";
    }
}

module.exports = ForbiddenError;
