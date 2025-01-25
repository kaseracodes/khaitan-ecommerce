const BadRequest = require("../errors/bad_request_error");
const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class ProductService {

    constructor(repository) {
        this.repository = repository
    }

    async createProduct(product) {
        try {
            const response = await this.repository.createProduct(
                product.title, product.description, product.price, product.categoryId, product.image);
            return response;
        } catch(error) {
            console.log("ProductService: ",error);
            throw new InternalServerError();
        }
    }
    
    async getProducts(query) {
        try {
            if((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
                throw new BadRequest("limit, offset", true);
            }
            if(query.min_price && isNaN(query.min_price)) {
                throw new BadRequest("min_price", true);
            }
            if(query.max_price && isNaN(query.max_price)) {
                throw new BadRequest("max_price", true);
            }
            const response = await this.repository.getProducts(+query.limit, +query.offset, +query.min_price, +query.max_price);
            return response;
        } catch(error) {
            if(error.name === "BadRequest") {
                throw error;
            }
            console.log("ProductService: ",error);
            throw new InternalServerError();
        }
       
    }
    
    async getProduct(id) {
        try {
            const response = await this.repository.getProduct(id);
            if(!response) {
                // we were not able to find anything
                console.log("ProductService: ", id, "not found");
                throw new NotFoundError("Product", "id", id);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("ProductService: ",error);
            throw new InternalServerError();
        }
        
    }

    async addAttributeToProduct(data) {
        try {

            const { productId, attributeId, value } = data;

            const response = this.repository.addAttributeToProduct(productId, attributeId, value);
            if(!response) {
                // we were not able to find anything
                console.log("ProductService: ", productId, "not found");
                throw new NotFoundError("Product", "id", productId);
            }
            return response;
        } catch (error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("Category Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyProduct(productId) {
        try {
            const response = await this.repository.destroyProduct(productId);
            if(!response) {
                console.log("ProductService: ", productId, "not found");
                throw new NotFoundError("Product", "id", productId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("ProductService: ",error);
            throw new InternalServerError();
        }
        
    }
}


module.exports = ProductService
