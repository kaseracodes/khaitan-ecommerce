const { Color } = require('../models/index');

class ColorRepository {
    async getColors() {
        try {
            const response = await Color.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getColor(id) {
        try {
            const response = await Color.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createColor(colorName, colorHex) {
        try {
            const response = await Color.create({
                colorName,
                colorHex
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateColor(id, colorName, colorHex) {
        try {
            // Perform the update operation
            const rowsUpdated = await Color.update(
                { 
                    colorName,
                    colorHex
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("Color", "id", id);
            }
    
            // Fetch the updated record explicitly
            const updatedColor = await Color.findOne({ where: { id } });
    
            if (!updatedColor) {
                throw new NotFoundError("Color", "id", id);
            }
    
            return updatedColor;
        } catch (error) {
            console.log("ColorRepository: ", error);
            throw error;
        }
    }
    

    async destroyColor(ColorId) {
        try {
            const response = await Color.destroy({
                where: {
                    id: ColorId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = ColorRepository;