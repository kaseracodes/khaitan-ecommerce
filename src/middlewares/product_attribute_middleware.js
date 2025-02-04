const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const BadRequest = require("../errors/bad_request_error");
const errorResponse = require("../utils/error_response");

function productAttributeValidator(req, res, next) {
    if(!req.body.productId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Product Id")))
    }

    if(!req.body.attributeId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Attribute Id")))
    }

    if(!req.body.value) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Value")))
    }

    // If everything looks good
    next();
}

module.exports = {
    productAttributeValidator
}