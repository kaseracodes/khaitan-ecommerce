const express = require('express');

const { JobApplicationController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');

const { createJobApplication, getAllJobApplications, getJobApplication, updateJobApplication, destroyJobApplication } = require('../../controllers/job_application_controller');
const { jobApplicationValidator, updateJobApplicationValidator } = require('../../middlewares/job_application_middleware');

const jobApplicationRouter = express.Router();

jobApplicationRouter.post('/', isLoggedIn, jobApplicationValidator, createJobApplication);
jobApplicationRouter.get('/', getAllJobApplications);

jobApplicationRouter.patch('/:id', updateJobApplicationValidator, updateJobApplication);
                        
jobApplicationRouter.get('/:id', getJobApplication);
jobApplicationRouter.delete('/:id', destroyJobApplication);

                        
// GET /api/v1/jobApplications/:id -> 
// GET /api/v1/jobApplications -> all jobApplications

module.exports = jobApplicationRouter;