const Category = require("./category");
const Product = require("./product");
const Cart = require("./cart");
const User = require("./user");
const CartProducts = require("./cart_products");
const Order = require("./order");
const OrderProducts = require("./order_products");
const Attribute = require("./attribute");
const { NODE_ENV } = require('../config/server_config');
async function syncDbInOrder() {
    await Category.sync();
    await Product.sync();
    await User.sync();
    await Cart.sync();
    await Order.sync();
    await CartProducts.sync();
    await OrderProducts.sync();
    await Attribute.sync();
}

Product.belongsTo(Category, {foreignKey: 'categoryId'});

Category.hasMany(Product, {foreignKey: 'categoryId'});


// One to one mapping of users and cart
// Cart belongs to one user
// User has one cart

User.hasOne(Cart);
Cart.belongsTo(User, {foreignKey: 'userId'});


// Many to Many mapping between cart and products
// Cart has many products through cart_products
// Product belongs to many cart through cart_products
Cart.belongsToMany(Product, { through: CartProducts });
Product.belongsToMany(Cart, { through: CartProducts });



Order.belongsTo(User, {foreignKey: 'userId'});

User.hasMany(Order, {foreignKey: 'userId'});

Order.belongsToMany(Product, { through: OrderProducts });

Product.belongsToMany(Order, { through: OrderProducts });

// One to one mapping of attributes and category
// Many attributes belong to one category
// One attribute only belongs to one category

Category.hasMany(Attribute, {foreignKey: 'categoryId'});

module.exports = {
    Product, Category, User, Cart, CartProducts, Order, OrderProducts, Attribute, syncDbInOrder
}