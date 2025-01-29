const { Media } = require('../models/index');

class MediaRepository {
    async getMedias() {
        try {
            const response = await Media.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getMedia(id) {
        try {
            const response = await Media.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createMedia(type, url, productId, colorId) {
        try {
            const response = await Media.create({
                type,
                url,
                productId,
                colorId
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateMedia(id, type, url, productId, colorId) {
        try {
            // Perform the update operation
            const rowsUpdated = await Media.update(
                { 
                    type,
                    url,
                    productId,
                    colorId
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("Media", "id", id);
            }
    
            // Fetch the updated record explicitly
            const updatedMedia = await Media.findOne({ where: { id } });
    
            if (!updatedMedia) {
                throw new NotFoundError("Media", "id", id);
            }
    
            return updatedMedia;
        } catch (error) {
            console.log("MediaRepository: ", error);
            throw error;
        }
    }
    

    async destroyMedia(mediaId) {
        try {
            const response = await Media.destroy({
                where: {
                    id: mediaId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = MediaRepository;