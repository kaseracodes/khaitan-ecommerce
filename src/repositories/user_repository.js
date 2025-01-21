const { User } = require('../models/index');

class UserRepository {
    async getUsers() {
        try {
            const response = await User.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getUser(id) {
        try {
            const response = await User.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const response = await User.findOne({
                where: {
                    email: email
                }
            })
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createUser(email, password, name, phoneNumber, roleId) {
        try {
            const response = await User.create({
                email,
                password,
                name, 
                phoneNumber, 
                roleId
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async destroyUser(userId) {
        try {
            const response = await User.destroy({
                where: {
                    id: userId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new NotFoundError('User', 'id', userId);
            }

            // Update fields dynamically based on updateData
            const updatedUser = await user.update(updateData);

            return updatedUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


module.exports = UserRepository;