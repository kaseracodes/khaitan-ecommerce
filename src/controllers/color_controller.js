const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { ColorService } = require('../services/index');
const { ColorRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const colorService = new ColorService(new ColorRepository());

async function createColor(req,res) {

    try {

        const response = await colorService.createColor(req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Color",
                    data: response
        });

    } catch(error) {
        console.log("ColorController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllColors(req,res) {

    try {

        const response = await colorService.getAllColors();

        return res
                .status(StatusCodes.OK)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.OK + " Colors",
                    data: response
        });

    } catch(error) {
        console.log("ColorController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getColor(req,res) {

    try {

        const response = await colorService.getColor(req.params.id);
            
                return res
                        .status(StatusCodes.OK)
                        .json({
                            sucess: true,
                            error: {},
                            message: ReasonPhrases.OK + " Color",
                            data: response
        });

    } catch (error) {
        console.log("ColorController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateColor(req, res) {
    try {

        const response = await colorService.updateColor(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Color",
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

async function destroyColor(req, res) {
    try {

        const response = await colorService.destroyColor(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Color",
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
    createColor,
    getAllColors,
    getColor,
    updateColor,
    destroyColor
}