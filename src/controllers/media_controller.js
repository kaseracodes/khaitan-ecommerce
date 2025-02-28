const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { MediaService } = require('../services/index');
const { MediaRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const mediaService = new MediaService(new MediaRepository());

async function createMedia(req,res) {

    try {

        const response = await mediaService.createMedia(req);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Media",
                    data: response
        });

    } catch(error) {
        console.log("MediaController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllMedias(req,res) {

    try {

        const response = await mediaService.getAllMedias(req.query);

        return res
                .status(StatusCodes.OK)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.OK + " Medias",
                    data: response
        });

    } catch(error) {
        console.log("MediaController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getMedia(req,res) {

    try {

        const response = await mediaService.getMedia(req.params.id);
            
                return res
                        .status(StatusCodes.OK)
                        .json({
                            sucess: true,
                            error: {},
                            message: ReasonPhrases.OK + " Media",
                            data: response
        });

    } catch (error) {
        console.log("MediaController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateMedia(req, res) {
    try {

        const response = await mediaService.updateMedia(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Media",
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

async function destroyMedia(req, res) {
    try {

        const response = await mediaService.destroyMedia(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Media",
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
    createMedia,
    getAllMedias,
    getMedia,
    updateMedia,
    destroyMedia
}