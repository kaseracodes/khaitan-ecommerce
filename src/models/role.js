const Sequelize = require('sequelize');
const db = require('../config/db_config');

const Role = db.define('role', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    parentRoleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'roles',
            key: 'id',
        },
    },
});

module.exports = Role;
