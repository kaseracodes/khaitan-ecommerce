const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { ProductService } = require('../services/index');
const { ProductRepository } = require('../repositories/index');
const errorResponse = require('../utils/error_response');

const productService = new ProductService(new ProductRepository());

async function createProduct(req, res) {

    try {
        
        const response = await productService.createProduct(req.body);
    
        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Product",
                    data: response
        });

    } catch(error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function addAttributeToProduct(req, res) {
    try {

        const response = await productService.addAttributeToProduct(req.params.id, req.body);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Attribute for Product",
                    data: response
        });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function bulkAddAttributesToProduct(req, res) {
    try {
        const productId = req.params.id;
        const attributes = req.body.attributes.map(attr => ({
            productId: productId,
            attributeId: attr.attributeId,
            value: attr.value
        }));

        const response = await productService.bulkAddAttributesToProduct(attributes);

        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Bulk Attributes for Product",
                    data: response
                });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(errorResponse(error.reason || ReasonPhrases.INTERNAL_SERVER_ERROR, error));
    }
}

async function getAllAttributesForProduct(req, res) {
    try {

        const response = await productService.getAllAttributesForProduct(req.params.id);

        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes for Product",
                    data: response
        });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllProductsWithAttributes(req, res) {
    try {

        const response = await productService.getAllProductsWithAttributes(req.query);

        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes for Product",
                    data: response
        });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getAllProductsWithAttributesAndMedia(req, res) {
    try {

        const response = await productService.getAllProductsWithAttributesAndMedia(req.query);

        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes and Media for Product",
                    data: response
        });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function getProductWithAttributesAndMedia(req, res) {
    try {
        const response = await productService.getProductWithAttributesAndMedia(req.params.id);
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes and Media for Product",
                    data: response
        });
    } catch(error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function updateAttributeForProduct(req, res) {
    try {

        const { productId, attributeId } = req.params;
        const { value } = req.body;

        const response = await productService.updateAttributeForProduct(productId, attributeId, value);

        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attribute for Product",
                    data: response
        });
    } catch (error) {
        console.log("ProductController: Something went wrong", error);
        return res  
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    } 
}

async function getProducts(req, res) {
    try {
        const response = await productService.getProducts(req.query);
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully fetched the Products",
                    data: response
        });
    } catch(error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}


async function getProduct(req, res) { // /api/v1/products/2
    try {
        const response = await productService.getProduct(req.params.id);
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully fetched the Product",
                    data: response
        });
    } catch(error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }
}

async function destroyProduct(req, res) {

    try {
        
        const response = await productService.destroyProduct(req.params.id);
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully deleted Product",
                    data: response
        });

    } catch(error) {
        console.log("ProductController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}


module.exports = {
    createProduct,
    addAttributeToProduct,
    bulkAddAttributesToProduct,
    getAllAttributesForProduct,
    getAllProductsWithAttributes,
    getAllProductsWithAttributesAndMedia,
    getProductWithAttributesAndMedia,
    updateAttributeForProduct,
    getProducts,
    getProduct,
    destroyProduct
}