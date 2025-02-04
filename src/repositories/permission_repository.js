const { Permission } = require('../models/index');

class PermissionRepository {

    async getPermissions() {
        try {
            const response = await Permission.findAll();
            return response;
        } catch (error) {
            console.log('Error fetching permissions:', error);
            throw error;
        }
    }

    async getPermission(id) {
        try {
            const response = await Permission.findByPk(id);
            return response;
        } catch (error) {
            console.log(`Error fetching permission with ID ${id}:`, error);
            throw error;
        }
    }

    async createPermission(name, description) {
        try {
            const response = await Permission.create({
                name,
                description,
            });
            return response;
        } catch (error) {
            console.log('Error creating permission:', error);
            throw error;
        }
    }

    async destroyPermission(permissionId) {
        try {
            const response = await Permission.destroy({
                where: {
                    id: permissionId,
                },
            });
            return response;
        } catch (error) {
            console.log(`Error deleting permission with ID ${permissionId}:`, error);
            throw error;
        }
    }
}

module.exports = PermissionRepository;
