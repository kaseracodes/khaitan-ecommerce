const { Media } = require('../models/index');
const { Op } = require("sequelize");

class MediaRepository {
    async getMedias(name, utility) {
        try {
            name = name != null ? String(name) : '';
            utility = utility != null ? String(utility) : '';
    
            const mediaItems = await Media.findAll({
                where: {
                    name: { [Op.like]: `%${name}%` },
                    utility: { [Op.like]: `%${utility}%` }
                }
            });
    
            if (!mediaItems || mediaItems.length === 0) {
                console.warn("MediaRepository: No media found");
                return [];
            }
    
            return mediaItems.map(item => ({
                id: item.id,
                name: item.name,
                utility: item.utility,
                url: item.url,
                colorId: item.colorId,
                productId: item.productId,
                redirectURL: item.redirectURL,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }));
    
        } catch (error) {
            console.error("MediaRepository: Error fetching media", error);
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

    async createMedia(type, url, productId, colorId, name, utility, redirectURL) {
        try {
            const response = await Media.create({
                type,
                url,
                productId,
                colorId,
                name,
                utility,
                redirectURL,
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateMedia(id, type, url, productId, colorId, name, utility, redirectURL) {
        try {
            // Perform the update operation
            const rowsUpdated = await Media.update(
                { 
                    type,
                    url,
                    productId,
                    colorId,
                    name,
                    utility,
                    redirectURL
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