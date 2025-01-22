const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class AttributeService {

    constructor(repository) {
        this.repository = repository;
    }

    async createAttribute(attribute) {
        try {
            const response = await this.repository.createAttribute(attribute.categoryId, attribute.name, attribute.dataType, attribute.unit);
            return response;
        } catch(error) {
            console.log("AttributeService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllAttributes() {
        try {
            const response = await this.repository.getAttributes();
            return response;
        } catch(error) {
            console.log("AttributeService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAttribute(attributeId) {
        try {
            const response = await this.repository.getAttribute(attributeId);
            if(!response) {
                // we were not able to find anything
                console.log("AttributeService: ", attributeId, "not found");
                throw new NotFoundError("Attribute", "id", attributeId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("AttributeService: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateAttribute(attributeId, data) {
        try{
            const { categoryId, name, description, dataType, unit } = data;

            const response = await this.repository.updateAttribute(attributeId, categoryId, name, description, dataType, unit);
            if(!response) {
                // we were not able to find anything
                console.log("AttributeService: ", attributeId, "not found");
                throw new NotFoundError("Attribute", "id", attributeId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("Attribute Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyAttribute(attributeId) {
        try {
            const response = await this.repository.destroyAttribute(attributeId);
            if(!response) {
                // we were not able to find anything
                console.log("AttributeService: ", attributeId, "not found");
                throw new NotFoundError("Attribute", "id", attributeId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("AttributeSerice: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = AttributeService