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
}

module.exports = RoleService;
