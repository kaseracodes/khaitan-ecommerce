const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class RoleService {

    constructor(repository) {
        this.repository = repository;
    }

    async getAllRoles() {
        try {
            const response = await this.repository.getRoles();
            return response;
        } catch (error) {
            console.log("RoleService: Error fetching all roles", error);
            throw new InternalServerError();
        }
    }

    async getRole(roleId) {
        try {
            const response = await this.repository.getRole(roleId);
            if (!response) {
                console.log("RoleService: Role with ID", roleId, "not found");
                throw new NotFoundError("Role", "id", roleId);
            }
            return response;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error fetching role", error);
            throw new InternalServerError();
        }
    }

    async createRole(role) {
        try {
            const response = await this.repository.createRole(
                role.name,
                role.description,
                role.parentRoleId
            );
            return response;
        } catch (error) {
            console.log("RoleService: Error creating role", error);
            throw new InternalServerError();
        }
    }

    async updateRole(roleId, updateData) {
        try {
            const response = await this.repository.updateRole(roleId, updateData);
            if (!response) {
                console.log("RoleService: Role with ID", roleId, "not found for update");
                throw new NotFoundError("Role", "id", roleId);
            }
            return response;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error updating role", error);
            throw new InternalServerError();
        }
    }

    async destroyRole(roleId) {
        try {
            const response = await this.repository.destroyRole(roleId);
            if (!response) {
                console.log("RoleService: Role with ID", roleId, "not found for deletion");
                throw new NotFoundError("Role", "id", roleId);
            }
            return response;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error deleting role", error);
            throw new InternalServerError();
        }
    }

    async addPermissionToRole(roleId, permissionId) {
        try {

            const role = await this.repository.getRole(roleId);
            if (!role) {
                throw new NotFoundError('Role', 'id', roleId);
            }

            // Validate if the permission exists (optional)
            // const permission = await new PermissionRepository().getPermission(permissionId);
            // if (!permission) {
            //     throw new NotFoundError('Permission', 'id', permissionId);
            // }

            const result = await this.repository.addPermissionToRole(roleId, permissionId);
            return result;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error in addPermissionToRole", error);
            throw new InternalServerError();
        }
    }

    async getPermissionsForRole(roleId) {
        try {
            const role = await this.repository.getRole(roleId);
            if (!role) {
                throw new NotFoundError('Role', 'id', roleId);
            }
    
            const permissions = await this.repository.getPermissionsForRole(roleId);
            return permissions;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error in getPermissionsForRole", error);
            throw new InternalServerError();
        }
    }

    async removePermissionFromRole(roleId, permissionId) {
        try {
            const role = await this.repository.getRole(roleId);
            if (!role) {
                throw new NotFoundError('Role', 'id', roleId);
            }
    
            // Optional: Validate if the permission exists
            // const permission = await new PermissionRepository().getPermission(permissionId);
            // if (!permission) {
            //     throw new NotFoundError('Permission', 'id', permissionId);
            // }
    
            const result = await this.repository.removePermissionFromRole(roleId, permissionId);
            return result;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error in removePermissionFromRole", error);
            throw new InternalServerError();
        }
    }

    async addPermissionsToRoleBulk(roleId, permissionIds) {
        try {
            const role = await this.repository.getRole(roleId);
            if (!role) {
                throw new NotFoundError('Role', 'id', roleId);
            }
    
            // Fetch existing permission ids for the role via the repository
            const existingPermissionIds = await this.repository.getExistingPermissionIdsForRole(roleId, permissionIds);
    
            // Filter out already existing permissions
            const newPermissionIds = permissionIds.filter((id) => !existingPermissionIds.includes(id));
    
            // Add only the new permissions via the repository
            const result = await this.repository.addPermissionsToRoleBulk(roleId, newPermissionIds);
    
            return result;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("RoleService: Error in addPermissionsToRoleBulk", error);
            throw new InternalServerError();
        }
    }
    
    async getAllRolePermissions() {
        try {
            const rolePermissions = await this.repository.getAllRolePermissions();
            return rolePermissions;
        } catch (error) {
            console.error('RoleService: Error in getAllRolePermissions', error);
            throw new InternalServerError();
        }
    }
        
}

module.exports = RoleService;
