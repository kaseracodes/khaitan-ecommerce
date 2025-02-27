const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class MediaService {

    constructor(repository) {
        this.repository = repository;
    }

    async createMedia(req) {
        try {
            const { type, productId, colorId, name, utility, redirectURL } = req.body;
            const mediaUrl = `/uploads/${req.file.filename}`;
            const response = await this.repository.createMedia(type, mediaUrl, productId, colorId, name, utility, redirectURL);
            return response;
        } catch(error) {
            console.log("MediaService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllMedias(query) {
        try {
            if (query.name && typeof query.name !== "string") {
                throw new BadRequest("name must be a string", true);
            }
            
            if (query.utility && typeof query.utility !== "string") {
                throw new BadRequest("usage must be a string", true);
            }

            const response = await this.repository.getMedias(query.name, query.utility);
            return response;
        } catch(error) {
            if(error.name === "BadRequest") {
                throw error;
            }
            console.log("MediaService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getMedia(mediaId) {
        try {
            const response = await this.repository.getMedia(mediaId);
            if(!response) {
                // we were not able to find anything
                console.log("MediaService: ", mediaId, "not found");
                throw new NotFoundError("Media", "id", mediaId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("MediaService: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateMedia(mediaId, data) {
        try{
            const { type, url, productId, colorId, name, utility, redirectURL } = data;

            const response = await this.repository.updateMedia(mediaId, type, url, productId, colorId, name, utility, redirectURL);
            if(!response) {
                // we were not able to find anything
                console.log("MediaService: ", mediaId, "not found");
                throw new NotFoundError("Media", "id", mediaId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("Media Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyMedia(mediaId) {
        try {
            const response = await this.repository.destroyMedia(mediaId);
            if(!response) {
                // we were not able to find anything
                console.log("MediaService: ", mediaId, "not found");
                throw new NotFoundError("Media", "id", mediaId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("MediaService: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = MediaService