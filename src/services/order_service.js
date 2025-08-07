const Razorpay = require("razorpay")
const crypto = require("crypto");

const { sendOrderConfirmationEmail, sendOrderConfirmationEmailWithInvoice } = require("../services/email_service");
const { generateInvoiceNumber, createInvoice } = require('../utils/invoice_generator');

const ForbiddenError = require("../errors/forbidden_error");
const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");
const UnauthorizedError = require("../errors/unauthorized_error");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../config/server_config");

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

class OrderService {

  constructor(repository, cartRepository, userRepository, colorRepository) {
      this.repository = repository;
      this.cartRepository = cartRepository;
      this.userRepository = userRepository;
      this.colorRepository = colorRepository;
    }
  
    async createOrder(userId, data) {
        try {
            // 1. Check if there is a cart for the user or not ?
            const cart = await this.cartRepository.getCartByUser(userId);
            if(!cart) {
                throw new NotFoundError('Cart', 'user id', userId);
            }
            const cartProducts = await cart.getProducts();
            console.log("Cart products: ", cartProducts);
            if(cartProducts.length == 0) {
                throw new InternalServerError();
            }
               
            // 2. Calculate total price
            let subTotal = 0, totalGST = 0, totalPrice = 0;
            cartProducts.forEach(product => {
                subTotal += product.price * product.cart_products.quantity;
                totalGST += (product.price*(product.gstPercent/100)) * product.cart_products.quantity;
            });
            totalPrice += subTotal + totalGST;
            console.log("Sub Total: ", subTotal);
            console.log("Total GST: ", totalGST);
            console.log("Total Price: ", totalPrice);

            // 3. Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: totalPrice * 100,
                currency: "INR",
                receipt: `order_rcptid_${Date.now()}`,
                payment_capture: 1,
            });
    
            // 4. Create a new empty order
            let { expectedDeliveryDate, deliveryAddress } = data;
            expectedDeliveryDate = new Date();
            const order = await this.repository.createOrder(userId, 'pending', subTotal, totalGST, totalPrice, 'processing', expectedDeliveryDate, null, deliveryAddress, razorpayOrder.id, null);
    
            // 5. Now use the order ID to add order products
            const orderProductsBulkCreateArray = await Promise.all(
              cartProducts.map(async (product) => {
                const colorId = product.cart_products.colorId;
                const getColorResponse = await this.colorRepository.getColor(colorId);
                return {
                  orderId: order.id,
                  productId: product.id,
                  quantity: product.cart_products.quantity,
                  orderedPrice: product.price,
                  orderedColorName: getColorResponse.colorName
                };
              })
            );
    
            console.log("Order Products to be created: ", orderProductsBulkCreateArray);    
            const orderProducts = await this.repository.addOrderProductsInBulk(
              orderProductsBulkCreateArray
            );
    
            return {
                orderId: order.id,
                products: orderProducts,
                razorpayOrderId: razorpayOrder.id,
                orderAmount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
    
        } catch(error) {
            if(error.name === "NotFoundError" || error.name === "UnauthorizedError") {
                throw error;
            }
            console.log("OrderService: ",error);
            throw new InternalServerError();
        }
    }  

    async verifyPayment(userId, data) {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

        // 1. Fetch order from database using razorpayOrderId
        let order = await this.repository.getOrderByRazorpayId(razorpay_order_id);
        if (!order) {
            throw new NotFoundError("Order", "razorpayOrderId", razorpay_order_id);
        }

        // 2. Generate HMAC SHA256 signature
        const generatedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // 3. Compare generated signature with received signature
        if (generatedSignature !== razorpay_signature) {
            throw new UnauthorizedError("Invalid payment signature");
        }

        // 4. Update order status to "succesfull" in the database
        order.status = "succesfull";
        order.invoiceNumber = generateInvoiceNumber(order.id);
        await order.save();

        // 5. Clear cart
        const cart = await this.cartRepository.getCartByUser(userId);
        if (cart) {
            await this.cartRepository.clearCart(cart.id);
        }

        const user = await this.userRepository.getUser(userId);
        if (!user) {
          throw new NotFoundError("User", "id", userId);
        }
        const orderId = order.id;
        order = await this.fetchOrderDetails(userId, orderId);
        const { buffer, invoiceNumber }  = await createInvoice(user, order);
        await sendOrderConfirmationEmailWithInvoice(buffer, user, order);
        return order;
      } catch (error) {
        if(error.name === "NotFoundError" || error.name === "UnauthorizedError") {
          throw error;
        }
        console.log("OrderService: ",error);
        throw new InternalServerError();
      }
    }
    
    async updateDeliveryStatus(userId, orderId, data) {
      try {
        const orderObject = await this.repository.getOrder(orderId);
        if(!orderObject) {
          throw new NotFoundError('Order', 'order id', orderId);
        }
  
        if(orderObject.userId != userId) {
          throw new UnauthorizedError('You are not authorised to do the current operation');
        }

        const { dateOfDelivery } = data;
  
        const response = await this.repository.updateDeliveryStatus(orderId, dateOfDelivery);

        return response;
      } catch(error) {
        if(error.name === "NotFoundError" || error.name === "UnauthorizedError") {
          throw error;
        }
        console.log("OrderService: ",error);
        throw new InternalServerError();
      }
    }
  
    async fetchOrderDetails(userId, orderId) {
      try {
        const order = await this.repository.fetchOrderDetails(orderId);
        if(!order) {
          throw new NotFoundError('Order', 'order id', orderId);
        }
  
        if(order.userId != userId) {
          throw new UnauthorizedError('You are not authorised to do the current operation');
        }
        
        return order;
      } catch(error) {
        if(error.name === "NotFoundError" || error.name === "UnauthorizedError") {
          throw error;
        }
        console.log("OrderService: ",error);
        throw new InternalServerError();
      }
    }

    async getOrdersDetailsForAllUsers(roleId, query) {
      try {
        if ((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
          throw new BadRequest("limit, offset", true);
        }

        if (query.status && typeof query.status !== "string") {
          throw new BadRequest("status must be a string", true);
        }

        const orderObject = await this.repository.getOrderDetails(null, query.limit ? +query.limit : undefined, query.offset ? +query.offset : undefined, query.status || null);

        if (!orderObject || orderObject.length === 0) {
          throw new NotFoundError('Orders', 'user id', 'admin');
        }

        return orderObject;
      } catch (error) {
        if (["NotFoundError", "UnauthorizedError", "ForbiddenError"].includes(error.name)) {
          throw error;
        }
        console.error("OrderService.getOrdersDetailsForAllUsers: ", error);
        throw new InternalServerError();
      }
    }

    async getOrdersDetailsForUser(userId, query) {
      try {
        if ((query.limit && isNaN(query.limit)) || (query.offset && isNaN(query.offset))) {
          throw new BadRequest("limit, offset", true);
        }

        if (query.status && typeof query.status !== "string") {
          throw new BadRequest("status must be a string", true);
        }

        const orderObject = await this.repository.getOrderDetails( userId, query.limit ? +query.limit : undefined, query.offset ? +query.offset : undefined, query.status || null );

        if (!orderObject || orderObject.length === 0) {
          throw new NotFoundError('User', 'user id', userId);
        }

        return orderObject;
      } catch (error) {
        if (["NotFoundError", "UnauthorizedError"].includes(error.name)) {
          throw error;
        }
        console.error("OrderService.getOrdersDetailsForUser: ", error);
        throw new InternalServerError();
      }
    }

}
  
  module.exports = OrderService;  