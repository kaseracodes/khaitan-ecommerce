const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { JobApplicationService } = require('../services/index');
const { JobApplicationRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const jobApplicationService = new JobApplicationService(new JobApplicationRepository());

async function createJobApplication(req,res) {

    try {

        const response = await jobApplicationService.createJobApplication(req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Job Application",
                    data: response
        });

    } catch(error) {
        console.log("JobApplicationController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllJobApplications(req,res) {

    try {

        const response = await jobApplicationService.getAllJobApplications(req.query);

        return res
                .status(StatusCodes.OK)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.OK + " Job Applications",
                    data: response
        });

    } catch(error) {
        console.log("JobApplicationController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getJobApplication(req,res) {

    try {

        const response = await jobApplicationService.getJobApplication(req.params.id);
            
                return res
                        .status(StatusCodes.OK)
                        .json({
                            sucess: true,
                            error: {},
                            message: ReasonPhrases.OK + " Job Application",
                            data: response
        });

    } catch (error) {
        console.log("JobApplicationController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateJobApplication(req, res) {
    try {

        const response = await jobApplicationService.updateJobApplication(req.params.id, req.body);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Job Application",
            data: response
        });

    } catch (error) {
        console.log("JobApplicationController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyJobApplication(req, res) {
    try {

        const response = await jobApplicationService.destroyJobApplication(req.params.id);

        return res
            .status(StatusCodes.OK)
            .json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Job Application",
            data: response
        });

    } catch (error) {
        console.log("JobApplicationController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode)
            .json(errorResponse(error.reason, error));
    }
}

module.exports = {
    createJobApplication,
    getAllJobApplications,
    getJobApplication,
    updateJobApplication,
    destroyJobApplication
}