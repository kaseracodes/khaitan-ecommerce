const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function colorValidator(req,res,next) {
    
    if (!req.body.colorName) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Name")))
    }
    if (!req.body.colorHex) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Hex Code")))
    }

    // If everything looks good
    next();
}

function updateColorValidator(req,res,next) {
    
    if (!req.body.colorName && !req.body.colorHex) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("No parameters present")))
    }

    // If everything looks good
    next();
}

module.exports = {
    colorValidator,
    updateColorValidator
}
