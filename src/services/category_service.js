const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class CategoryService {

    constructor(repository, productRepository, attributeRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.attributeRepository = attributeRepository;
    }

    async getProductsForCategory(categoryId) {
        try {
            await this.getCategory(categoryId);
            const response = await this.productRepository.getProductsForCategory(categoryId);
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
    }

    async getAttributesForCategory(categoryId) {
        try {
            await this.getCategory(categoryId);
            const response = await this.attributeRepository.getAttributesForCategory(categoryId);
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
    }

    async getAllProductsWithAttributesForCategory(categoryId, query) {
        try {
    
            if((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
                throw new BadRequest("limit, offset", true);
            }

            const response = await this.productRepository.getAllProductsWithAttributesForCategory(categoryId, +query.limit, +query.offset);

            return response;
        } catch (error) {
            if (error.name === "BadRequest") {
                throw error;
            }
            console.error("CategoryService: ", error);
            throw new InternalServerError();
        }
    }

    async getAllProductsWithAttributesAndMediaForCategory(categoryId, query) {
        try {
    
            if((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
                throw new BadRequest("limit, offset", true);
            }

            const response = await this.productRepository.getAllProductsWithAttributesAndMediaForCategory(categoryId, +query.limit, +query.offset);

            return response;
        } catch (error) {
            if (error.name === "BadRequest") {
                throw error;
            }
            console.error("CategoryService: ", error);
            throw new InternalServerError();
        }
    }

    async createCategory(category) {
        try {
            const response = await this.repository.createCategory(category.name, category.description);
            return response;
        } catch(error) {
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
        
    }

    async getAllCategories() {
        try {
            const response = await this.repository.getCategories();
            return response;
        } catch(error) {
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
        
    }

    async getCategory(categoryId) {
        try {
            const response = await this.repository.getCategory(categoryId);
            if(!response) {
                // we were not able to find anything
                console.log("CategoryService: ", categoryId, "not found");
                throw new NotFoundError("Category", "id", categoryId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
        
    }

    async updateCategory(categoryId, data) {
        try{
            const { name,description } = data;

            const response = await this.repository.updateCategory(categoryId, name, description);
            if(!response) {
                // we were not able to find anything
                console.log("CategoryService: ", categoryId, "not found");
                throw new NotFoundError("Category", "id", categoryId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("Category Service: ",error);
            throw new InternalServerError();
        }
    }

    async destroyCategory(categoryId) {
        try {
            const response = await this.repository.destroyCategory(categoryId);
            if(!response) {
                // we were not able to find anything
                console.log("CategoryService: ", categoryId, "not found");
                throw new NotFoundError("Category", "id", categoryId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("CategorySerice: ",error);
            throw new InternalServerError();
        }
        
    }
    
}


module.exports = CategoryService
