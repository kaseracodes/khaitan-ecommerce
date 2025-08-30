const Sequelize = require('sequelize');
const db = require('../config/db_config');

// https://medium.com/@the_ozmic/how-to-create-many-to-many-relationship-using-sequelize-orm-postgres-on-express-677753a3edb5
// https://medium.com/@tavilesa12/dealing-with-many-to-many-associations-in-sequelize-bddc34201b80

const OrderProducts = db.define('order_products', {
    orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id'
        }
    },
    orderedColorName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    orderedPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    indexes: [
        {
            unique: true,
            name: 'composite_pk_order_product_color',
            fields: ['orderId', 'productId', 'orderedColorName']
        }
    ]
});

module.exports = OrderProducts;
