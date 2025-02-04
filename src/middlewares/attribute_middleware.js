const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const errorResponse = require('../utils/error_response');
const BadRequest = require('../errors/bad_request_error');

function attributeValidator(req,res,next) {
    
    if (!req.body.categoryId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Category Id")))
    }
    if (!req.body.name) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Name")))
    }
    if (!req.body.dataType) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Data Type")))
    }
    if (!req.body.unit) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Unit")))
    }

    // If everything looks good
    next();
}

module.exports = {
    attributeValidator
}
