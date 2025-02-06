const Sequelize = require('sequelize');
const db = require('../config/db_config');

const Permission = db.define('permission', {
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
});

module.exports = Permission;
