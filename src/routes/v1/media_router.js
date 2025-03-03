const express = require('express')

const { updateMediaValidator } = require('../../middlewares/media_middleware');
const uploadMiddleware = require('../../middlewares/cloud_upload_middleware');
const { isLoggedIn } = require('../../middlewares/auth_middlewares');
const hasPermission = require('../../middlewares/access_control_middlewares');

const { createMedia, updateMedia, getAllMedias, getMedia, destroyMedia } = require('../../controllers/media_controller');

const mediaRouter = express.Router();

mediaRouter.post('/', isLoggedIn, hasPermission('media:create'), uploadMiddleware("products").single("media"), createMedia);

mediaRouter.patch('/:id', isLoggedIn, hasPermission('media:update'), updateMediaValidator, updateMedia);
                        
mediaRouter.get('/', getAllMedias);
mediaRouter.get('/:id', getMedia);
mediaRouter.delete('/:id', isLoggedIn, hasPermission('media:delete'), destroyMedia);


module.exports = mediaRouter;