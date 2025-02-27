const express = require('express')

const { updateMediaValidator } = require('../../middlewares/media_middleware');
const upload = require('../../middlewares/upload_middleware');
const { createMedia, updateMedia, getAllMedias, getMedia, destroyMedia } = require('../../controllers/media_controller');

const mediaRouter = express.Router();

mediaRouter.post('/', upload.single("media"), createMedia);

mediaRouter.patch('/:id', updateMediaValidator, updateMedia);
                        
mediaRouter.get('/', getAllMedias);
mediaRouter.get('/:id', getMedia);
mediaRouter.delete('/:id', destroyMedia);

                        
// GET /api/v1/Medias/:id -> 
// GET /api/v1/Medias -> all Medias

module.exports = mediaRouter;