const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { CategoryService }  = require('../services/index');
const { ProductRepository, CategoryRepository, AttributeRepository } = require('../repositories/index');

const errorResponse = require('../utils/error_response');
const { response } = require('express');

const categoryService = new CategoryService(new CategoryRepository(), new ProductRepository(), new AttributeRepository());

async function createCategory(req, res) {

    try {
        
        const response = await categoryService.createCategory(req.body);
    
        return res
                .status(StatusCodes.CREATED)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.CREATED + " Category",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function getAllCategories(req, res) {

    try {
        
        const response = await categoryService.getAllCategories();
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully fetched Categories",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function getProductsForCategory(req, res) {

    try {
        
        const response = await categoryService.getProductsForCategory(req.params.id);
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully fetched Products for the Category",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        console.log("Errorname", error.name)
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function getAttributesForCategory(req, res) {

    try {
        
        const response = await categoryService.getAttributesForCategory(req.params.id);
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: ReasonPhrases.OK + " Attributes of Category",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        console.log("Errorname", error.name)
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function getAllProductsWithAttributesForCategory(req, res) {
    try {
        const response = await categoryService.getAllProductsWithAttributesForCategory(req.params.id, req.query);

        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Products with Attributes for Category",
            data: response
        });
    } catch (error) {
        console.error("CategoryController: Something went wrong", error);
        return res.status(error.statusCode || 500).json(errorResponse(error.reason, error));
    }
}

async function getAllProductsWithAttributesAndMediaForCategory(req, res) {
    try {
        const response = await categoryService.getAllProductsWithAttributesAndMediaForCategory(req.params.id, req.query);

        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: ReasonPhrases.OK + " Products with Attributes and Media for Category",
            data: response
        });
    } catch (error) {
        console.error("CategoryController: Something went wrong", error);
        return res.status(error.statusCode || 500).json(errorResponse(error.reason, error));
    }
}

async function getCategory(req, res) {

    try {
        
        const response = await categoryService.getCategory(req.params.id);
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully fetched Category",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        console.log("Errorname", error.name)
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}

async function updateCategory(req, res) {
    try {
        // Call the partialUpdateCategory service function
        const response = await categoryService.updateCategory(req.params.id, req.body);

        // // Return success response
        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully updated Category",
            data: response
        });
        // return res.json("Done");

    } catch (error) {
        console.log("CategoryController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function destroyCategory(req, res) {

    try {
        
        const response = await categoryService.destroyCategory(req.params.id);
    
        return res
                .status(StatusCodes.OK)
                .json({
                    sucess: true,
                    error: {},
                    message: "Successfully deleted Category",
                    data: response
        });

    } catch(error) {
        console.log("CategoryController: Something went wrong", error);
        return res
                .status(error.statusCode)
                .json(errorResponse(error.reason, error));
    }

}


module.exports = {
    destroyCategory,
    getCategory,
    createCategory,
    getAllCategories,
    getProductsForCategory,
    updateCategory,
    getAttributesForCategory,
    getAllProductsWithAttributesForCategory,
    getAllProductsWithAttributesAndMediaForCategory
}