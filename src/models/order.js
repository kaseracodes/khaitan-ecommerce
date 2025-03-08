const Sequelize = require('sequelize');
const db = require('../config/db_config');

// https://sequelize.org/docs/v7/models/data-types/
const Order = db.define('order', {
    status: {
        type: Sequelize.ENUM({
            values: ['pending', 'cancelled', 'succesfull']
        }),
        allowNull: false,
    },
    deliveryStatus: {
        type: Sequelize.ENUM({
            values: ['processing', 'delivered'],
        }),
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    expectedDeliveryDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    dateOfDelivery: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deliveryAddress: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    razorpayOrderId: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Order;