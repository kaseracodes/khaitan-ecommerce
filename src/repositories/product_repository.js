const { Product, ProductAttributes, Attribute, Category, Media, Color } = require('../models/index');
const { Op, where } = require('sequelize');
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

    async bulkAddAttributesToProduct(attributes) {
        try {
            const response = await ProductAttributes.bulkCreate(attributes);
            return response;
        } catch (error) {
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
    
    async getAllProductsWithAttributes(limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
    
            const products = await Product.findAll({
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
                ...filter
            });
 
            if (!products || products.length === 0) {
                console.error("ProductRepository: No products found");
                return [];
            }

            const productsWithFormattedAttributes = products.map(product => ({
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
            }));
    
            return productsWithFormattedAttributes;
        } catch (error) {
            console.error("ProductRepository: Error fetching products with attributes", error);
            throw error;
        }
    }
    
    async getAllProductsWithAttributesForCategory(categoryId, limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }

            const products = await Product.findAll({
                where: { categoryId },
                include: [
                    {
                        model: Category,
                        attributes: ["name"],
                    },
                    {
                        model: Attribute,
                        as: "attributes",
                        through: { attributes: ["value"] },
                    },
                ],
                ...filter
            });
    
            if (!products || products.length === 0) {
                throw new NotFoundError(`No products found for category ${categoryId}`);
            }

            const categoryName = products[0].category.name;
    
            const productsList = products.map(product => ({
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.image,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                attributes: product.attributes.map(attr => ({
                    id: attr.id,
                    name: attr.name,
                    dataType: attr.dataType,
                    unit: attr.unit,
                    value: attr.products_attributes.value,
                })),
            }));

            return {
                categoryId,
                categoryName,
                productsList
            };
        } catch (error) {
            console.error("CategoryRepository: Error fetching products with attributes", error);
            throw error;
        }
    };

    async getAllProductsWithAttributesAndMediaForCategory(categoryId, limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }

            const products = await Product.findAll({
                where: { categoryId },
                include: [
                    {
                        model: Category,
                        attributes: ["name"],
                    },
                    {
                        model: Attribute,
                        as: "attributes",
                        through: { attributes: ["value"] },
                    },
                    {
                        model: Media,
                        as: "media",
                        include: [
                            {
                                model: Color,
                                as: "color",
                                attributes: ["colorName", "colorHex"],
                            },
                        ],
                    }
                ],
                ...filter
            });
    
            if (!products || products.length === 0) {
                throw new NotFoundError(`No products found for category ${categoryId}`);
            }

            const categoryName = products[0].category.name;
    
            const productsList = products.map(product => ({
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
                media: product.media.map(med => ({
                    id: med.id,
                    type: med.type,
                    url: med.url,
                    colorId: med.colorId,
                    colorName: med.color.colorName,
                    colorHex: med.color.colorHex
                })),
            }));

            return {
                categoryId,
                categoryName,
                productsList
            };
        } catch (error) {
            console.error("CategoryRepository: Error fetching products with attributes", error);
            throw error;
        }
    };

    async getAllProductsWithAttributesAndMedia(limit, offset) {
        try {
            const filter = {};
            if(limit) {
                filter.limit = limit;
            }
            if(offset) {
                filter.offset = offset;
            }
    
            const products = await Product.findAll({
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
                    {
                        model: Media,
                        as: "media",
                        include: [
                            {
                                model: Color,
                                as: "color",
                                attributes: ["colorName", "colorHex"],
                            },
                        ],
                    }
                ],
                ...filter
            });
 
            if (!products || products.length === 0) {
                console.error("ProductRepository: No products found");
                return [];
            }

            const productsWithFormattedAttributes = products.map(product => ({
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
                media: product.media.map(med => ({
                    id: med.id,
                    type: med.type,
                    url: med.url,
                    colorId: med.colorId,
                    colorName: med.color.colorName,
                    colorHex: med.color.colorHex
                })),
            }));
    
            return productsWithFormattedAttributes;
        } catch (error) {
            console.error("ProductRepository: Error fetching products with attributes", error);
            throw error;
        }
    }

    async getProductWithAttributesAndMedia(productdId) {
        try {
            const product = await Product.findByPk(productdId, {
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
                    {
                        model: Media,
                        as: "media",
                        include: [
                            {
                                model: Color,
                                as: "color",
                                attributes: ["colorName", "colorHex"],
                            },
                        ],
                    }
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
                media: product.media.map(med => ({
                    id: med.id,
                    type: med.type,
                    url: med.url,
                    colorId: med.colorId,
                    colorName: med.color.colorName,
                    colorHex: med.color.colorHex
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