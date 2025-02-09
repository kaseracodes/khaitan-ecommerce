const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class JobOpeningService {

    constructor(repository) {
        this.repository = repository;
    }

    async createJobOpening(jobOpening) {
        try {
            const response = await this.repository.createJobOpening(jobOpening.title, jobOpening.description, jobOpening.location, jobOpening.employmentType, jobOpening.department, jobOpening.salaryRange, jobOpening.openings);
            return response;
        } catch(error) {
            console.log("JobOpeningService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllJobOpenings(query) {
        try {
            if((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
                throw new BadRequest("limit, offset", true);
            }

            const response = await this.repository.getJobOpenings(+query.limit, +query.offset);
            return response;
        } catch(error) {
            if(error.name === "BadRequest") {
                throw error;
            }
            console.log("JobOpeningService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getJobOpening(jobOpeningId) {
        try {
            const response = await this.repository.getJobOpening(jobOpeningId);
            if(!response) {
                // we were not able to find anything
                console.log("JobOpeningService: ", jobOpeningId, "not found");
                throw new NotFoundError("jobOpening", "id", jobOpeningId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobOpeningService: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateJobOpening(jobOpeningId, data) {
        try{
            const { title, description, location, employmentType, department, salaryRange, openings } = data;

            const response = await this.repository.updateJobOpening(jobOpeningId, title, description, location, employmentType, department, salaryRange, openings);
            if(!response) {
                // we were not able to find anything
                console.log("JobOpeningService: ", jobOpeningId, "not found");
                throw new NotFoundError("JobOpening", "id", jobOpeningId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobOpening Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyJobOpening(jobOpeningId) {
        try {
            const response = await this.repository.destroyJobOpening(jobOpeningId);
            if(!response) {
                // we were not able to find anything
                console.log("JobOpeningService: ", jobOpeningId, "not found");
                throw new NotFoundError("JobOpening", "id", jobOpeningId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("JobOpeningService: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = JobOpeningService