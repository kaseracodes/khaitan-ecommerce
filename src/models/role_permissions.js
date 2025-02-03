const Sequelize = require('sequelize');
const db = require('../config/db_config');

const RolePermissions = db.define('role_permissions', {
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Roles',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Permissions', 
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }
});

module.exports = RolePermissions;
