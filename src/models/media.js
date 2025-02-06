const Sequelize = require('sequelize');
const db = require('../config/db_config');
const Color = require('./color')
const Product = require('./product')

// https://medium.com/@the_ozmic/how-to-create-many-to-many-relationship-using-sequelize-orm-postgres-on-express-677753a3edb5
// https://medium.com/@tavilesa12/dealing-with-many-to-many-associations-in-sequelize-bddc34201b80

const Media = db.define('media', {
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    utility: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    redirectURL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    colorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'colors',
            key: 'id'
        }
    }
});

module.exports = Media;