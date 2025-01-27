const { Product, ProductAttributes, Attribute, Category } = require('../models/index');
const { Op } = require('sequelize');
class ProductRepository {
    async getProducts(limit, offset, min_price, max_price) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
            const minValue = (min_price) ? min_price : Number.MIN_SAFE_INTEGER;
            const maxValue = (max_price) ? max_price : Number.MAX_SAFE_INTEGER;
            const response = await Product.findAll({
                where: {
                    price: {
                        [Op.between]: [minValue, maxValue]
                    }
                },
                ...filter
            });
            return response;
            
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getProduct(id) {
        try {
            const response = await Product.findByPk(id);
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async createProduct(title, description, price, categoryId, image) {
        try {
            const response = await Product.create({
                title, description, price, categoryId, image
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async addAttributeToProduct(productId, attributeId, value) {
        try {
            const response = await ProductAttributes.create({
                productId, attributeId, value
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getAllAttributesForProduct(id) {
        try {
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ["name"],
                    },
                    {
                        model: Attribute,
                        as: "attributes",
                        through: {
                            attributes: ["value"],
                        },
                    },
                ],
            });
    
            if (!product) {
                console.error("ProductRepository: Product not found", id);
                return null;
            }

            const productWithFormattedAttributes = {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.image,
                categoryId: product.categoryId,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                categoryName: product.category?.name || null,
                attributes: product.attributes.map(attr => ({
                    id: attr.id,
                    name: attr.name,
                    dataType: attr.dataType,
                    unit: attr.unit,
                    value: attr.products_attributes.value,
                })),
            };
    
            return productWithFormattedAttributes;
    
        } catch (error) {
            console.error("ProductRepository: Error fetching attributes for product", error);
            throw error;
        }
    }

    async updateAttributeForProduct(productId, attributeId, value) {
        try {

            const [affectedRows] = await ProductAttributes.update(
                { value },
                {
                    where: {
                        productId,
                        attributeId,
                    },
                }
            );

            if (affectedRows === 0) {
                console.error(
                    `ProductRepository: Product with id ${productId} or Attribute with id ${attributeId} not found`
                );
                return null;
            }

            const productWithFormattedAttributes = this.getAllAttributesForProduct(productId, attributeId, value);
    
            return productWithFormattedAttributes;
        } catch (error) {
            console.error("ProductRepository: Error updating attribute for product", error);
            throw error;
        }
    }
        

    async destroyProduct(productId) {
        try {
            const response = await Product.destroy({
                where: {
                    id: productId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getProductsForCategory(categoryId) {
        try {
            const response = await Product.findAll({
                where: {
                    categoryId: categoryId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async destroyProduct(productId) {
        try {
            const response = await Product.destroy({
                where: {
                    id: productId
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async searchProduct(searchQuery) {
        try {
            const response = await Product.findAll({
                where: {
                    title: {
                        [Op.like]: `%${searchQuery}%`
                    }
                }
            });
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }
    
}


module.exports = ProductRepository;