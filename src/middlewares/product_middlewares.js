const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const BadRequest = require("../errors/bad_request_error");
const errorResponse = require("../utils/error_response");

function createProductValidator(req, res, next) {
    if(!req.body.title) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Title")))
    }

    if(!req.body.description) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Description")))
    }

    if(!req.body.price) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Price")))
    }

    if(!req.body.image) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Image")))
    }

    if(!req.body.categoryId) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Category")))
    }

    // If everything looks good
    next();
}

function updateAttributeForProductValidator(req, res, next) {
    if (!req.body.value || !req.params.productId || !req.params.attributeId) {
        return res  
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("ProductId or AttributeId")))
    }
    
    // If everything looks good
    next();
}

module.exports = {
    createProductValidator,
    updateAttributeForProductValidator
}