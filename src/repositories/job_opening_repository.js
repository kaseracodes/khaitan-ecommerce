const { JobOpening, JobApplication } = require('../models/index');
const { Op } = require('sequelize');

class JobOpeningRepository {
    async getJobOpenings(limit, offset, jobStatus) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
    
            const jobOpenings = await JobOpening.findAll({
                where: {
                    jobStatus: { [Op.eq]: jobStatus }
                },
                ...filter
            });
    
            if (!jobOpenings || jobOpenings.length === 0) {
                console.warn("JobOpeningRepository: No Job Opening found");
                return [];
            }
    
            return jobOpenings;
    
        } catch (error) {
            console.error("JobOpeningRepository: Error fetching Job Openings", error);
            throw error;
        }
    }
    
    async getJobApplicationsForOpening(id, limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
    
            const jobOpenings = await JobApplication.findAll({
                where: {
                    jobOpeningId: id,
                },
                ...filter
            });
    
            if (!jobOpenings || jobOpenings.length === 0) {
                console.warn("JobOpeningRepository: No Applications for Job Opening found");
                return [];
            }
    
            return jobOpenings;
    
        } catch (error) {
            console.error("JobOpeningRepository: Error fetching Job Openings", error);
            throw error;
        }
    }
    

    async getJobOpening(id) {
        try {
            const jobOpenings = await JobOpening.findByPk(id);
            return jobOpenings;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createJobOpening(title, description, location, employmentType, department, salaryRange, openings, jobStatus) {
        try {
            const jobOpenings = await JobOpening.create({
                title, 
                description, 
                location, 
                employmentType, 
                department, 
                salaryRange, 
                openings,
                jobStatus
            });
            return jobOpenings;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateJobOpening(id, title, description, location, employmentType, department, salaryRange, openings, jobStatus) {
        try {
            // Perform the update operation
            const rowsUpdated = await JobOpening.update(
                { 
                    title, 
                    description, 
                    location, 
                    employmentType, 
                    department, 
                    salaryRange, 
                    openings,
                    jobStatus
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("Job Opening", "id", id);
            }
    
            // Fetch the updated record explicitly
            const updatedJobOpening = await JobOpening.findOne({ where: { id } });
    
            if (!updatedJobOpening) {
                throw new NotFoundError("Job Opening", "id", id);
            }
    
            return updatedJobOpening;
        } catch (error) {
            console.log("JobOpeningRepository: ", error);
            throw error;
        }
    }
    

    async destroyJobOpening(jobOpeningId) {
        try {
            const jobOpenings = await JobOpening.destroy({
                where: {
                    id: jobOpeningId
                }
            });
            return jobOpenings;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = JobOpeningRepository;