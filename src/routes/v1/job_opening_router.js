const express = require('express');

const { JobOpeningController } = require('../../controllers/index');

const { createJobOpening, updateJobOpening, getAllJobOpenings, getAllJobApplicationsForOpening, getJobOpening, destroyJobOpening } = require('../../controllers/job_opening_controller');
const { jobOpeningValidator, updateJobOpeningValidator } = require('../../middlewares/job_opening_middleware');

const jobOpeningRouter = express.Router();

jobOpeningRouter.post('/', jobOpeningValidator, createJobOpening);
jobOpeningRouter.get('/', getAllJobOpenings);

jobOpeningRouter.patch('/:id', updateJobOpeningValidator, updateJobOpening);
                        
jobOpeningRouter.get('/:id/application', getAllJobApplicationsForOpening);
jobOpeningRouter.get('/:id', getJobOpening);
jobOpeningRouter.delete('/:id', destroyJobOpening);

                        
// GET /api/v1/jobOpenings/:id -> 
// GET /api/v1/jobOpenings -> all jobOpenings

module.exports = jobOpeningRouter;