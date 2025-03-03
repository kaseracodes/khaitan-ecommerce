const express = require('express');

const { JobApplicationController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createJobApplication, getAllJobApplications, getJobApplication, updateJobApplication, destroyJobApplication } = require('../../controllers/job_application_controller');
const { jobApplicationValidator, updateJobApplicationValidator } = require('../../middlewares/job_application_middleware');
const uploadMiddleware = require('../../middlewares/cloud_upload_middleware');

const jobApplicationRouter = express.Router();

jobApplicationRouter.post('/', isLoggedIn, uploadMiddleware("resume").single("resume"), jobApplicationValidator, createJobApplication);
jobApplicationRouter.get('/', isLoggedIn, hasPermission('jobApplication:read'), getAllJobApplications);

jobApplicationRouter.patch('/:id', isLoggedIn, hasPermission('jobApplication:update'), updateJobApplicationValidator, updateJobApplication);
                        
jobApplicationRouter.get('/:id', isLoggedIn, hasPermission('jobApplication:read_one'), getJobApplication);
jobApplicationRouter.delete('/:id', isLoggedIn, destroyJobApplication);

                        
// GET /api/v1/jobApplications/:id -> 
// GET /api/v1/jobApplications -> all jobApplications

module.exports = jobApplicationRouter;