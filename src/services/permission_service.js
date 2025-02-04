const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class PermissionService {
    constructor(repository) {
        this.repository = repository;
    }

    async createPermission(permission) {
        try {
            const response = await this.repository.createPermission(permission.name, permission.description);
            return response;
        } catch (error) {
            console.log("PermissionService: ", error);
            throw new InternalServerError();
        }
    }

    async getAllPermissions() {
        try {
            const response = await this.repository.getPermissions();
            return response;
        } catch (error) {
            console.log("PermissionService: ", error);
            throw new InternalServerError();
        }
    }

    async getPermission(permissionId) {
        try {
            const response = await this.repository.getPermission(permissionId);
            if (!response) {
                console.log("PermissionService: ", permissionId, "not found");
                throw new NotFoundError("Permission", "id", permissionId);
            }
            return response;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("PermissionService: ", error);
            throw new InternalServerError();
        }
    }

    async destroyPermission(permissionId) {
        try {
            const response = await this.repository.destroyPermission(permissionId);
            if (!response) {
                console.log("PermissionService: ", permissionId, "not found");
                throw new NotFoundError("Permission", "id", permissionId);
            }
            return response;
        } catch (error) {
            if (error.name === "NotFoundError") {
                throw error;
            }
            console.log("PermissionService: ", error);
            throw new InternalServerError();
        }
    }
}

module.exports = PermissionService;
