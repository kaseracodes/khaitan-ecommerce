const { JobApplication } = require('../models/index');

class JobApplicationRepository {
    async getJobApplications(limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
    
            const jobApplications = await JobApplication.findAll({
                ...filter
            });
    
            if (!jobApplications || jobApplications.length === 0) {
                console.warn("JobApplicationRepository: No Job Application found");
                return [];
            }
    
            return jobApplications;
    
        } catch (error) {
            console.error("JobApplicationRepository: Error fetching Job Applications", error);
            throw error;
        }
    }    

    async getJobApplication(id) {
        try {
            const jobApplications = await JobApplication.findByPk(id);
            return jobApplications;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createJobApplication(applicantName, applicantEmail, resumeURL, applicationStatus, appliedDate, jobOpeningId) {
        try {
            const jobApplications = await JobApplication.create({
                applicantName, 
                applicantEmail, 
                resumeURL, 
                applicationStatus, 
                appliedDate, 
                jobOpeningId
            });
            return jobApplications;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateJobApplication(id, applicationStatus) {
        try {
            // Perform the update operation
            const rowsUpdated = await JobApplication.update(
                { 
                    applicationStatus
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("Job Application", "id", id);
            }
    
            // Fetch the updated record explicitly
            const updatedJobApplication = await JobApplication.findOne({ where: { id } });
    
            if (!updatedJobApplication) {
                throw new NotFoundError("Job Application", "id", id);
            }
    
            return updatedJobApplication;
        } catch (error) {
            console.log("JobApplicationRepository: ", error);
            throw error;
        }
    }
    

    async destroyJobApplication(jobApplicationId) {
        try {
            const jobApplications = await JobApplication.destroy({
                where: {
                    id: jobApplicationId
                }
            });
            return jobApplications;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = JobApplicationRepository;