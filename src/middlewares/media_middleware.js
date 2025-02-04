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
    if (!req.body.productId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Product Id")))
    }
    if (!req.body.colorId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Color Id")))
    }

    // If everything looks good
    next();
}

function updateMediaValidator(req,res,next) {
    
    if (!req.body.type && !req.body.url && !req.body.productId && !req.body.colorId) {
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
