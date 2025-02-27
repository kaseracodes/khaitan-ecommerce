const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function jobApplicationValidator(req, res, next) {
    if (!req.body.applicantName) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Applicant Name")))
    }

    if (!req.body.applicantEmail) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Applicant Email")))
    }

    if (!req.body.jobOpeningId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Job Opening Id")))
    }

    // If everything looks good
    next();
}

function updateJobApplicationValidator(req,res,next) {
    if(!req.body.applicationStatus) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("No Parameters Available")))
    }

    // If everything looks good
    next();
}

module.exports = {
    jobApplicationValidator,
    updateJobApplicationValidator
}