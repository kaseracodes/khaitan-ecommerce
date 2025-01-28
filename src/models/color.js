const Sequelize = require('sequelize');
const db = require('../config/db_config');

// https://sequelize.org/docs/v7/models/data-types/
const Color = db.define('color', {
    colorName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    colorHex: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Color;