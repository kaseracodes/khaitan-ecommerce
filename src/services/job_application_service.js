const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class JobApplicationService {

    constructor(repository) {
        this.repository = repository;
    }

    async createJobApplication(req) {
        try {
            const { applicantName, applicantEmail, appliedDate, jobOpeningId } = req.body;
            const resumeUrl = req.file.location;
            const response = await this.repository.createJobApplication(applicantName, applicantEmail, resumeUrl, "Under Review" , appliedDate, jobOpeningId);
            return response;
        } catch(error) {
            console.log("JobApplicationService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllJobApplications(query) {
        try {
            if((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
                throw new BadRequest("limit, offset", true);
            }

            const response = await this.repository.getJobApplications(+query.limit, +query.offset);
            return response;
        } catch(error) {
            if(error.name === "BadRequest") {
                throw error;
            }
            console.log("JobApplicationService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getJobApplication(jobApplicationId) {
        try {
            const response = await this.repository.getJobApplication(jobApplicationId);
            if(!response) {
                // we were not able to find anything
                console.log("JobApplicationService: ", jobApplicationId, "not found");
                throw new NotFoundError("jobApplication", "id", jobApplicationId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobApplicationService: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateJobApplication(jobApplicationId, data) {
        try{
            const { applicationStatus } = data;

            const response = await this.repository.updateJobApplication(jobApplicationId, applicationStatus);
            if(!response) {
                // we were not able to find anything
                console.log("JobApplicationService: ", jobApplicationId, "not found");
                throw new NotFoundError("JobApplication", "id", jobApplicationId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobApplication Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyJobApplication(jobApplicationId) {
        try {
            const response = await this.repository.destroyJobApplication(jobApplicationId);
            if(!response) {
                // we were not able to find anything
                console.log("JobApplicationService: ", jobApplicationId, "not found");
                throw new NotFoundError("JobApplication", "id", jobApplicationId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobApplicationService: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = JobApplicationService