const { Category } = require('../models/index');

class CategoryRepository {
    async getCategories() {
        try {
            const response = await Category.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getCategory(id) {
        try {
            const response = await Category.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createCategory(name, description) {
        try {
            const response = await Category.create({
                name,
                description
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateCategory(id, name, description) {
        try {
            // Find category based of id (primary key) for proper identification
            const category = await Category.findByPk(id);

            // Update the name or description
            const response = await category.update({
                name,
                description
            });
            return response;
        } catch(error) {
            console.log(error);
            throw(error);
        }
    }

    async destroyCategory(categoryId) {
        try {
            const response = await Category.destroy({
                where: {
                    id: categoryId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = CategoryRepository;