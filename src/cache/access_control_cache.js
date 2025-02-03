const { Role, Permission, RolePermissions } = require('../models/index');

class AccessControlCache {
    constructor() {
        console.log("AccessControlCache instance created");
        this.permissionMap = new Map(); // { permissionId: permissionObject }
        this.roleMap = new Map(); // { roleId: { ...roleObject, permissionIds: [] } }
    }

    async syncCache() {
        try {
            console.log("Syncing Access Control Cache...");
            this.permissionMap.clear();
            this.roleMap.clear();
    
            const permissions = await Permission.findAll();
            permissions.forEach((perm) => this.permissionMap.set(perm.id, perm.dataValues));

            const roles = await Role.findAll();
            roles.forEach((role) => {
                this.roleMap.set(role.id, { ...role.dataValues, permissionIds: [] });
            });
    
            const rolePermissions = await RolePermissions.findAll();
    
            rolePermissions.forEach(({ roleId, permissionId }) => {
                if (this.roleMap.has(roleId)) {
                    const role = this.roleMap.get(roleId);
                    if (!role.permissionIds.includes(permissionId)) {
                        role.permissionIds.push(permissionId);
                    }
                }
            });
    
            console.log("Access Control Cache Loaded Successfully.");
            console.log(this.permissionMap);
            console.log(this.roleMap);
        } catch (error) {
            console.error("Error syncing access control cache:", error);
        }
    }
    

    getRoleById(roleId) {
        return this.roleMap.get(roleId) || null;
    }

    getPermissionIdByName(permissionName) {
        const permission = [...this.permissionMap.values()].find(
            (perm) => perm.name === permissionName
        );
        return permission ? permission.id : null;
    }

    hasPermission(roleId, permissionName) {
        const role = this.getRoleById(roleId);
        if (!role) {
            return false;
        }
        const permissionId = this.getPermissionIdByName(permissionName);
        if (!permissionId) {
            return false;
        }

        return role.permissionIds.includes(permissionId);
    }


}

// Ensures a singleton instance of the class
module.exports = new AccessControlCache();
