const Permission = require("./permission");
const Role = require("./role");
const RolePermissions = require("./role_permissions");
const { accessControlCache } = require("../cache");

async function syncAccessControlCache() {
    await accessControlCache.syncCache();
}

module.exports = {
    registerHooks(models) {
        Role.addHook('afterCreate', syncAccessControlCache);
        Role.addHook('afterUpdate', syncAccessControlCache);
        Role.addHook('afterDestroy', syncAccessControlCache);

        Permission.addHook('afterCreate', syncAccessControlCache);
        Permission.addHook('afterUpdate', syncAccessControlCache);
        Permission.addHook('afterDestroy', syncAccessControlCache);

        RolePermissions.addHook('afterCreate', syncAccessControlCache);
        RolePermissions.addHook('afterUpdate', syncAccessControlCache);
        RolePermissions.addHook('afterDestroy', syncAccessControlCache);
    }
};



