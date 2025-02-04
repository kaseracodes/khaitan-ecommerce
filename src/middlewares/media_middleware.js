const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function mediaValidator(req,res,next) {
    
    if (!req.body.type) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Type")))
    }
    if (!req.body.url) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("URL")))
    }

    // If everything looks good
    next();
}

function updateMediaValidator(req,res,next) {
    
    if (!req.body.type && !req.body.url && !req.body.name && !req.body.utility && !req.body.productId && !req.body.colorId && !req.body.redirectURL) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("No parameters present")))
    }

    // If everything looks good
    next();
}

module.exports = {
    mediaValidator,
    updateMediaValidator
}
