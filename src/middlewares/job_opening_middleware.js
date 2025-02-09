const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function jobOpeningValidator(req, res, next) {
    if (!req.body.title) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Title")))
    }

    if (!req.body.employmentType) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Employment Type")))
    }

    // If everything looks good
    next();
}

function updateJobOpeningValidator(req,res,next) {
    if(!req.body.title && !req.body.description && !req.body.location && !req.body.employmentType && !req.body.department && !req.body.salaryRange && !req.body.openings) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("No Parameters Available")))
    }

    // If everything looks good
    next();
}

module.exports = {
    jobOpeningValidator,
    updateJobOpeningValidator
}