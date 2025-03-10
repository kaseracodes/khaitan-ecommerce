const CategoryService = require('./category_service');
const ProductService = require('./product_service');
const UserService = require('./user_service');
const CartService = require('./cart_service');
const OrderService = require('./order_service');
const AttributeService = require('./attribute_service');
const ColorService = require('./color_service');
const MediaService = require('./media_service');
const PermissionService = require('./permission_service');
const RoleService = require('./role_service');
const JobOpeningService = require('./job_opening_service');
const JobApplicationService = require('./job_application_service');

module.exports = {
    CategoryService, 
    ProductService, 
    UserService, 
    CartService,
    OrderService,
    AttributeService, 
    ColorService, 
    MediaService,
    PermissionService,
    RoleService,
    JobOpeningService,
    JobApplicationService
}