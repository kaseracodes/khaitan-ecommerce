const express = require('express')

const { updateMediaValidator } = require('../../middlewares/media_middleware');
const uploadMiddleware = require('../../middlewares/cloud_upload_middleware');
const { createMedia, updateMedia, getAllMedias, getMedia, destroyMedia } = require('../../controllers/media_controller');

const mediaRouter = express.Router();

mediaRouter.post('/', uploadMiddleware("products").single("media"), createMedia);

mediaRouter.patch('/:id', updateMediaValidator, updateMedia);
                        
mediaRouter.get('/', getAllMedias);
mediaRouter.get('/:id', getMedia);
mediaRouter.delete('/:id', destroyMedia);


module.exports = mediaRouter;