const { Role, Permission, RolePermissions } = require('../models/index');
const { Op } = require('sequelize');
const NotFoundError = require("../errors/not_found_error");

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

    async addPermissionToRole(roleId, permissionId) {
        try {
            const result = await RolePermissions.findOne({
                where: {
                    [Op.and]: [{ roleId }, { permissionId }],
                },
            });

            // A permission should be added to a role only if its already added 
            if (!result) {
                await RolePermissions.create({ roleId, permissionId });
            }

            const response = await RolePermissions.findAll({
                where: { roleId },
            });

            return {
                roleId,
                permissions: response,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getPermissionsForRole(roleId) {
        try {
            const permissions = await Role.findOne({
                where: { id: roleId },
                include: {
                    model: Permission,
                    through: {
                        attributes: [] // Exclude all fields from the RolePermissions join table
                        // If data for 'when a permission was added to a role" is needed, include createdAt attribute here.
                    }
                }
            });
    
            return permissions;
        } catch (error) {
            console.error("RoleRepository: Error in getPermissionsForRole", error);
            throw error;
        }
    }
    
    async removePermissionFromRole(roleId, permissionId) {
        try {
            const result = await RolePermissions.findOne({
                where: {
                    [Op.and]: [{ roleId }, { permissionId }],
                },
            });
    
            if (!result) {
                throw new NotFoundError('RolePermission', '{roleId, permissionId}', `{${roleId}, ${permissionId}}`);
            }
    
            await RolePermissions.destroy({
                where: {
                    roleId,
                    permissionId,
                },
            });
    
            // Fetch the updated permissions for the role
            const updatedPermissions = await this.getPermissionsForRole(roleId)
            return updatedPermissions;

        } catch (error) {
            console.error("RoleRepository: Error in removePermissionFromRole", error);
            throw error;
        }
    }

}

module.exports = RoleRepository;
