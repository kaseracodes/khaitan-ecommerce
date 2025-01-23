const CategoryService = require('./category_service');
const ProductService = require('./product_service');
const UserService = require('./user_service');
const CartService = require('./cart_service');
const OrderService = require('./order_service');
const PermissionService = require('./permission_service');
const RoleService = require('./role_service');

module.exports = {
    CategoryService, 
    ProductService, 
    UserService, 
    CartService,
    OrderService,
    PermissionService,
    RoleService
}