const express = require('express');

const { JobOpeningController } = require('../../controllers/index');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createJobOpening, updateJobOpening, getAllJobOpenings, getAllJobApplicationsForOpening, getJobOpening, destroyJobOpening } = require('../../controllers/job_opening_controller');
const { jobOpeningValidator, updateJobOpeningValidator } = require('../../middlewares/job_opening_middleware');

const jobOpeningRouter = express.Router();

jobOpeningRouter.post('/', isLoggedIn, hasPermission('jobOpening:create'), jobOpeningValidator, createJobOpening);
jobOpeningRouter.get('/', getAllJobOpenings);

jobOpeningRouter.patch('/:id', isLoggedIn, hasPermission('jobOpening:update'), updateJobOpeningValidator, updateJobOpening);
                        
jobOpeningRouter.get('/:id/application', isLoggedIn, hasPermission('jobOpening:read_application'), getAllJobApplicationsForOpening);
jobOpeningRouter.get('/:id', getJobOpening);
jobOpeningRouter.delete('/:id', isLoggedIn, hasPermission('jobOpening:delete'), destroyJobOpening);

                        
// GET /api/v1/jobOpenings/:id -> 
// GET /api/v1/jobOpenings -> all jobOpenings

module.exports = jobOpeningRouter;