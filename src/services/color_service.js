const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class ColorService {

    constructor(repository) {
        this.repository = repository;
    }

    async createColor(color) {
        try {
            const response = await this.repository.createColor(color.colorName, color.colorHex);
            return response;
        } catch(error) {
            console.log("ColorService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllColors() {
        try {
            const response = await this.repository.getColors();
            return response;
        } catch(error) {
            console.log("ColorService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getColor(colorId) {
        try {
            const response = await this.repository.getColor(colorId);
            if(!response) {
                // we were not able to find anything
                console.log("ColorService: ", colorId, "not found");
                throw new NotFoundError("color", "id", colorId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("ColorService: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateColor(colorId, data) {
        try{
            const { colorName, colorHex } = data;

            const response = await this.repository.updateColor(colorId, colorName, colorHex);
            if(!response) {
                // we were not able to find anything
                console.log("ColorService: ", colorId, "not found");
                throw new NotFoundError("Color", "id", colorId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("Color Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyColor(colorId) {
        try {
            const response = await this.repository.destroyColor(colorId);
            if(!response) {
                // we were not able to find anything
                console.log("ColorService: ", colorId, "not found");
                throw new NotFoundError("color", "id", colorId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("ColorSerice: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = ColorService