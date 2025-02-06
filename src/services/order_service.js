const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");

class OrderService {

  constructor(repository, cartRepository) {
      this.repository = repository;
      this.cartRepository = cartRepository;
    }
  
    async createOrder(userId) {
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
            let totalPrice = 0;
            cartProducts.forEach(product => {
                totalPrice += product.price * product.cart_products.quantity;
            });
            console.log("Total Price: ", totalPrice);
    
            // 3. Create a new empty order
            const order = await this.repository.createOrder(userId, 'pending', totalPrice);
    
            // 4. Now use the order ID to add order products
            const orderProductsBulkCreateArray = cartProducts.map(product => {
              return {
                  orderId: order.id,
                  productId: product.id,
                  quantity: product.cart_products.quantity
              }
            })
    
            console.log("Order Products to be created: ", orderProductsBulkCreateArray);    
            const orderProducts = await this.repository.addOrderProductsInBulk(
              orderProductsBulkCreateArray
            );
    
            // 5. Update order status
            console.log("Initial State: ",order);
            order.status = "succesfull";
            await order.save();
            console.log("Final State: ", order);
    
            // 6. Clear the cart
            await this.cartRepository.clearCart(cart.id);
    
            return {
                orderId: order.id,
                products: orderProducts
            }
    
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
        const orderObject = await this.repository.getOrder(orderId);
        if(!orderObject) {
          throw new NotFoundError('Order', 'order id', orderId);
        }
  
        if(orderObject.userId != userId) {
          throw new UnauthorizedError('You are not authorised to do the current operation');
        }
  
        const response = await this.repository.fetchOrderDetails(orderId);
        const order = {
          id: response.id,
          status: response.status,
          totalPrice: response.totalPrice,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        }; 
        order.products = response.products.map(product => {
          return {
            title: product.title,
            price: product.price,
            id: product.id,
            quantity: product.order_products.quantity
          }
        }); 
        return order;
      } catch(error) {
        if(error.name === "NotFoundError" || error.name === "UnauthorizedError") {
          throw error;
        }
        console.log("OrderService: ",error);
        throw new InternalServerError();
      }
    }
  }
  
  module.exports = OrderService;  