const ProductRepository = require('./product_repository');
const FakeStoreProductRepository = require('./fake_store_repository');
const CategoryRepository = require('./category_repository');
const UserRepository = require('./user_repository');
const CartRepository = require('./cart_repository');
const OrderRepository = require('./order_repository');
const AttributeRepository = require('./attribute_repository');
const ColorRepository = require('./color_repository');
const MediaRepository = require('./media_repository');
const PermissionRepository = require('./permission_repository');
const RoleRepository = require('./role_repository');
const JobOpeningRepository = require('./job_opening_repository');
const JobApplicationRepository = require('./job_application_repository');

module.exports = {
    ProductRepository, 
    FakeStoreProductRepository, 
    CategoryRepository, 
    UserRepository,
    CartRepository,
    OrderRepository,
    AttributeRepository,
    ColorRepository,
    MediaRepository,
    PermissionRepository,
    RoleRepository,
    JobOpeningRepository,
    JobApplicationRepository
}