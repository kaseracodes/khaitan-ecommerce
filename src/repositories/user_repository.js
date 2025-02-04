const { Op } = require("sequelize");

const { User, Role } = require('../models/index');

class UserRepository {
    async getRegularUsers() {
        try {
            const users = await User.findAll({
                where: {
                    roleId: 1, // users with roleId = 1 are regular users
                }
            });
            return users;
        } catch(error) {
            console.log("UserRepository: Error fetching regular users", error);
            throw error;
        }
    }

    async getRoleUnverifiedUsers() {
        try {
            const unverifiedUsers = await User.findAll({
                where: {
                    isRoleVerified: false,
                    roleId: { [Op.ne]: 1 }
                },
            });
            return unverifiedUsers;
        } catch (error) {
            console.log("UserRepository: Error fetching unverified users", error);
            throw error;
        }
    }

    async getAdminUsers() {
        try {
            // Fetch all users with roleId != 1 and isRoleVerified = true, include their roles
            const admins = await User.findAll({
                where: {
                    roleId: { [Op.ne]: 1 }, 
                    isRoleVerified: true
                },
                include: { model: Role}, 
            });
            return admins;
        } catch (error) {
            console.log("UserRepository: Error fetching admin users", error);
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