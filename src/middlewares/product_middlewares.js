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

function bulkAddAttributesValidator(req, res, next) {
    if (!req.params.id) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("ProductId is required in URL")));
    }

    if (!req.body.attributes || !Array.isArray(req.body.attributes) || req.body.attributes.length === 0) {
        return res  
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Attributes array is required")));
    }

    for (const attr of req.body.attributes) {
        if (!attr.attributeId || !attr.value) {
            return res  
                .status(StatusCodes.BAD_REQUEST)
                .json(errorResponse(ReasonPhrases.BAD_REQUEST, new BadRequest("Each attribute must include attributeId and value")));
        }
    }

    // If everything looks good
    next();
}


module.exports = {
    createProductValidator,
    updateAttributeForProductValidator,
    bulkAddAttributesValidator
}