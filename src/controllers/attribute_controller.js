const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { AttributeService } = require('../services/index');
const { AttributeRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const attributeService = new AttributeService(new AttributeRepository());

async function createAttribute(req,res) {

    try {

        const response = await attributeService.createAttribute(req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Attribute",
                    data: response
        });

    } catch(error) {
        console.log("AttributeController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllAttributes(req,res) {

    try {

        const response = await attributeService.getAllAttributes();

        return res
                .status(StatusCodes.OK)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes",
                    data: response
        });

    } catch(error) {
        console.log("AttributeController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAttribute(req,res) {

    try {

        const response = await attributeService.getAttribute(req.params.id);
            
                return res
                        .status(StatusCodes.OK)
                        .json({
                            sucess: true,
                            error: {},
                            message: ReasonPhrases.OK + " Attribute",
                            data: response
        });

    } catch (error) {
        console.log("AttributeController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateAttribute(req, res) {
    try {

        const response = await attributeService.updateAttribute(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Attribute",
            data: response
        });

    } catch (error) {
        console.log("AtrributeController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyAttribute(req, res) {
    try {

        const response = await attributeService.destroyAttribute(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Attribute",
            data: response
        });

    } catch (error) {
        console.log("AtrributeController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

module.exports = {
    createAttribute,
    getAllAttributes,
    getAttribute,
    updateAttribute,
    destroyAttribute
}