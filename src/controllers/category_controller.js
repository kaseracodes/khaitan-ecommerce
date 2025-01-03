const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { CategoryService }  = require('../services/index');
const { ProductRepository, CategoryRepository } = require('../repositories/index');

const errorResponse = require('../utils/error_response');
const { response } = require('express');

const categoryService = new CategoryService(new CategoryRepository(), new ProductRepository());

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
        // Extract name and description from request body
        const { name, description } = req.body;

        // Validate if name and description are provided
        if (!name || !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: { message: "Name and description are required" },
                message: "Invalid input",
                data: {}
            });
        }

        // Call the updateCategory service function
        const response = await categoryService.updateCategory(req.params.id, name, description);

        // Return success response
        return res.status(StatusCodes.OK).json({
            success: true,
            error: {},
            message: "Successfully updated Category",
            data: response
        });

    } catch (error) {
        console.log("CategoryController: Something went wrong", error);
        console.log("Errorname", error.name);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.reason, error));
    }
}

async function partialUpdateCategory(req, res) {
    try {
        // Extract name and description from request body
        const { name,description } = req.body;
        console.log(req.body);

        // Validate if updates are provided
        if (!name && !description) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                error: { message: "No updates are required" },
                message: "Invalid input",
                data: {}
            });
        }

        // Call the partialUpdateCategory service function
        const response = await categoryService.partialUpdateCategory(req.params.id, name, description);

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
    partialUpdateCategory
}