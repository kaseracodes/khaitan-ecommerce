const { Order, OrderProducts, Product } = require('../models/index');
const { Op } = require('sequelize');

class OrderRepository {
    async getOrders() {
        try {
            const response = await Order.findAll();
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getOrder(id) {
        try {
            const response = await Order.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createOrder(userId, status, totalPrice, deliveryStatus, expectedDeliveryDate, dateOfDelivery) {
        try {
            const response = await Order.create({
                userId,
                status,
                totalPrice,
                deliveryStatus, 
                expectedDeliveryDate, 
                dateOfDelivery
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async addOrderProductsInBulk(orderProducts) {
        try {
            const response = await OrderProducts.bulkCreate(orderProducts);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async updateDeliveryStatus(orderId, dateOfDelivery) {
        try {

            await Order.update(
                {
                    deliveryStatus: 'delivered',
                    dateOfDelivery: dateOfDelivery
                },
                {
                    where: { id: orderId }
                }
            );
    
            const updatedOrder = await Order.findByPk(orderId);
            return updatedOrder;

        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async fetchOrderDetails(orderId) {
        try {
            const response = await Order.findOne({
                where: {
                    id: orderId
                },
                include: {
                    model: Product,
                    attributes: ['title', 'id', 'price'],
                    through: {
                        model: OrderProducts,
                        attributes: ['quantity']
                    }
                },
                attributes: ['id', 'status', 'totalPrice' , 'deliveryStatus', 'expectedDeliveryDate', 'dateOfDelivery', 'createdAt', 'updatedAt'],
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getOrderDetails(userId, limit, offset, status) {
        try {
            const filter = {};

            if (limit) {
            filter.limit = limit;
            }
            if (offset) {
            filter.offset = offset;
            }

            const whereClause = {};

            if (userId !== null) {
            whereClause.userId = userId;
            }

            if (status) {
            whereClause.status = { [Op.eq]: status };
            }

            const queryOptions = {
            where: whereClause,
            include: {
                model: Product,
                attributes: ['title', 'id', 'price'],
                through: {
                model: OrderProducts,
                attributes: ['quantity']
                }
            },
            ...filter,
            attributes: ['id', 'userId', 'status', 'totalPrice', 'deliveryStatus', 'expectedDeliveryDate', 'dateOfDelivery', 'createdAt', 'updatedAt'],
            };

            const response = await Order.findAll(queryOptions);

            if (userId !== null) {
            return response.map(order => ({
                    id: order.id,
                    status: order.status,
                    totalPrice: order.totalPrice,
                    deliveryStatus: order.deliveryStatus,
                    expectedDeliveryDate: order.expectedDeliveryDate,
                    dayOfDelivery: order.dateOfDelivery,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    products: order.products.map(product => ({
                    title: product.title,
                    price: product.price,
                    id: product.id,
                    quantity: product.order_products.quantity,
                })),
            }));
            }

            return response;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
  
}   


module.exports = OrderRepository;