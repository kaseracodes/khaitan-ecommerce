const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class MediaService {

    constructor(repository) {
        this.repository = repository;
    }

    async createMedia(media) {
        try {
            const response = await this.repository.createMedia(media.type, media.url, media.productId, media.colorId);
            return response;
        } catch(error) {
            console.log("MediaService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllMedias() {
        try {
            const response = await this.repository.getMedias();
            return response;
        } catch(error) {
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
            const { type, url, productId, colorId } = data;

            const response = await this.repository.updateMedia(mediaId, type, url, productId, colorId);
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