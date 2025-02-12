const { Attribute } = require('../models/index');

class AttributeRepository {
    async getAttributes() {
        try {
            const response = await Attribute.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getAttribute(id) {
        try {
            const response = await Attribute.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createAttribute(categoryId, name, dataType, unit) {
        try {
            const response = await Attribute.create({
                categoryId,
                name,
                dataType,
                unit
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateAttribute(id, categoryId, name, dataType, unit) {
        try {
            // Perform the update operation
            const rowsUpdated = await Attribute.update(
                { 
                    categoryId,
                    name, 
                    dataType,
                    unit
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("Attribute", "id", id);
            }
    
            // Fetch the updated record explicitly
            const updatedAttribute = await Attribute.findOne({ where: { id } });
    
            if (!updatedAttribute) {
                throw new NotFoundError("Attribute", "id", id);
            }
    
            return updatedAttribute;
        } catch (error) {
            console.log("AttributeRepository: ", error);
            throw error;
        }
    }

    async getAttributesForCategory(categoryId) {
        try {
            const response = await Attribute.findAll({
                where: {
                    categoryId: categoryId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
    

    async destroyAttribute(attributeId) {
        try {
            const response = await Attribute.destroy({
                where: {
                    id: attributeId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = AttributeRepository;