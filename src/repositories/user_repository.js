const { Op } = require("sequelize");

const { User, Role, Cart } = require('../models/index');

const otpCache = require("../cache/otp_cache");

const ForbiddenError = require("../errors/forbidden_error");

const NotFoundError = require("../errors/not_found_error");

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
            const response = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            const cart = await Cart.findOne({
                where: { userId: id }
            });
    
            return { ...response.toJSON(), cartId: cart.id };
        } catch (error) {
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

    async updateUserDetails(id, name) {
        try {
            const rowsUpdated = await User.update(
                { 
                    name, 
                },
                { 
                    where: { id }
                }
            );
    
            // If no rows were updated, throw a NotFoundError
            if (rowsUpdated[0] === 0) {
                throw new NotFoundError("User", "id", id);
            }
    
            const updatedUser = await User.findOne({ where: { id } });
        
            if (!updatedUser) {
                throw new NotFoundError("User", "id", id);
            }
    
            return updatedUser;
        } catch (error) {
            console.log("UserRepository: ", error);
            throw error;
        }
    }

    async destroyUser(id) {
        try {
            const response = await User.destroy({
                where: {
                    id: id
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            const user = await User.findByPk(id);

            if (!user) {
                throw new NotFoundError('User', 'id', id);
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