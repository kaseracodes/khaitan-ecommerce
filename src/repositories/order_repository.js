const { Order, OrderProducts, Product } = require('../models/index');
const { Op, where } = require('sequelize');

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

    async getOrderByRazorpayId(id) {
        try {
            const order = await Order.findOne({
                where: {
                    razorpayOrderId: id
                }
            });

            return order;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createOrder(userId, status, subTotal, totalGST, totalPrice, deliveryStatus, expectedDeliveryDate, dateOfDelivery, deliveryAddress, razorpayOrderId, invoiceNumber) {
        try {
            const response = await Order.create({
                userId,
                status,
                subTotal,
                totalGST,
                totalPrice,
                deliveryStatus, 
                expectedDeliveryDate, 
                dateOfDelivery,
                deliveryAddress,
                razorpayOrderId,
                invoiceNumber
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

        const order = await Order.findByPk(orderId, { raw: true });

        if (!order) {
          throw new Error('Order not found');
        }

        const orderProducts = await OrderProducts.findAll({ where: { orderId }, raw: true });
        const productIds = [...new Set(orderProducts.map(op => op.productId))];
        const products = await Product.findAll({ where: { id: productIds }, raw: true });

        const productMap = {};
        products.forEach(product => { productMap[product.id] = product; });

        const fullOrderProducts = orderProducts.map(op => ({
          ...op,
          ...productMap[op.productId]
        }));

        order.products = fullOrderProducts;
        console.dir(order, { depth: null });
        return order;

      } catch (error) {
        console.error("OrderRepository.fetchOrderDetails Error:", error);
        throw error;
      }
    }
    
    async getOrderDetails(userId, limit, offset, status) {
      try {
        const filter = {};
        if (limit) filter.limit = limit;
        if (offset) filter.offset = offset;

        const whereClause = {};
        if (userId !== null) whereClause.userId = userId;
        if (status) whereClause.status = { [Op.eq]: status };

        const queryOptions = {
          where: whereClause,
          include: {
            model: Product,
            through: { model: OrderProducts }, // include all fields
          },
          ...filter,
          // No attributes specified — fetch all fields from Order
        };

        const orders = await Order.findAll(queryOptions);

        // Format the output
        return orders.map(order => {
            const plainOrder = order.get({ plain: true });

            // Merge order_products fields into product and exclude order_products itself
            plainOrder.products = plainOrder.products.map(product => {
              const { order_products, ...productData } = product;
              return {
                ...productData,
                ...order_products, // merge join table data directly
              };
            });

          return plainOrder;
        });

      } catch (error) {
        console.error("OrderRepository.getOrderDetails Error:", error);
        throw error;
      }
    }
    
  
}   


module.exports = OrderRepository;