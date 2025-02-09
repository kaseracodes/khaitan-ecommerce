const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { JobOpeningService } = require('../services/index');
const { JobOpeningRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const jobOpeningService = new JobOpeningService(new JobOpeningRepository());

async function createJobOpening(req,res) {

    try {

        const response = await jobOpeningService.createJobOpening(req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Job Opening",
                    data: response
        });

    } catch(error) {
        console.log("JobOpeningController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllJobOpenings(req,res) {

    try {

        const response = await jobOpeningService.getAllJobOpenings(req.query);

        return res
                .status(StatusCodes.OK)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.OK + " Job Openings",
                    data: response
        });

    } catch(error) {
        console.log("JobOpeningController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getJobOpening(req,res) {

    try {

        const response = await jobOpeningService.getJobOpening(req.params.id);
            
                return res
                        .status(StatusCodes.OK)
                        .json({
                            sucess: true,
                            error: {},
                            message: ReasonPhrases.OK + " Job Opening",
                            data: response
        });

    } catch (error) {
        console.log("JobOpeningController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateJobOpening(req, res) {
    try {

        const response = await jobOpeningService.updateJobOpening(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Job Opening",
            data: response
        });

    } catch (error) {
        console.log("JobOpeningController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyJobOpening(req, res) {
    try {

        const response = await jobOpeningService.destroyJobOpening(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Job Opening",
            data: response
        });

    } catch (error) {
        console.log("JobOpeningController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

module.exports = {
    createJobOpening,
    getAllJobOpenings,
    getJobOpening,
    updateJobOpening,
    destroyJobOpening
}