const { Role } = require('../models/index');

class RoleRepository {

    async getRoles() {
        try {
            const response = await Role.findAll();
            return response;
        } catch (error) {
            console.log("RoleRepository: Error in getRoles", error);
            throw error;
        }
    }

    async getRole(id) {
        try {
            const response = await Role.findByPk(id);
            return response;
        } catch (error) {
            console.log("RoleRepository: Error in getRole", error);
            throw error;
        }
    }

    async createRole(name, description, parentRoleId = null) {
        try {
            const response = await Role.create({
                name,
                description,
                parentRoleId
            });
            return response;
        } catch (error) {
            console.log("RoleRepository: Error in createRole", error);
            throw error;
        }
    }

    async updateRole(roleId, updateData) {
        try {
            const role = await Role.findByPk(roleId);
    
            if (!role) {
                throw new NotFoundError('Role', 'id', userId);
            }
    
            const updatedRole = await role.update(updateData);
            
            return updatedRole;
        } catch (error) {
            console.log("RoleRepository: Error in updateRole", error);
            throw error;
        }
    }
    

    async destroyRole(roleId) {
        try {
            const response = await Role.destroy({
                where: {
                    id: roleId
                }
            });
            return response;
        } catch (error) {
            console.log("RoleRepository: Error in destroyRole", error);
            throw error;
        }
    }
}

module.exports = RoleRepository;
