const BadRequest = require("../errors/bad_request_error");
const ConflictError = require("../errors/conflict_error");
const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");
const ForbiddenError = require("../errors/forbidden_error");
const bcrypt = require('bcrypt');
const UnauthorizedError = require("../errors/unauthorized_error");
const { generateJWT } = require("../utils/auth");
class UserService {

    constructor(respository, cartRepository) {
        this.respository = respository;
        this.cartRepository = cartRepository;
    }


    async createUser(user) {
        try {
            const response = await this.respository.createUser(user.email, user.password, user.name, user.phoneNumber, user.roleId);
            await this.cartRepository.createCart(response.id);
            return response;
        } catch(error) {
            console.log("UserService: ", error.name);
            if(error.name === "SequelizeUniqueConstraintError") {
                throw new ConflictError("User", error.errors[0].message)
            }
            if(error.name === "SequelizeValidationError") {
                let propertiesHavingValidationIssue = "";
                let reason = [];
                error.errors.forEach((err) => {
                    propertiesHavingValidationIssue += err.path + ", ";
                    reason.push(err.message);
                });

                throw new BadRequest(propertiesHavingValidationIssue, true, reason);
            }
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
        
    }

    async signinUser(userRequestObject) {
        try {
            const user = await this.respository.getUserByEmail(userRequestObject.email);
            if(!user) {
                console.log("UserService: ", userRequestObject.email, "not found");
                throw new NotFoundError("User", "email", userRequestObject.email);
            }
            const doesPasswordMatch = bcrypt.compareSync(userRequestObject.password, user.password);
            if(!doesPasswordMatch) {
                throw new UnauthorizedError();
            }
            // roleId 0 corresponds to a normal user.
            if((user.roleId != 0) && (!user.isRoleVerified)){
                throw new ForbiddenError('Admin Panel', 'signin', 'Role unverified')
            }
            return generateJWT({
                email: user.email, 
                id: user.id, 
                roleId: user.roleId
            });
        } catch(error) {
            console.log("UserService: ",error);
            if(error.name === "NotFoundError" || error.name === "UnauthorizedError" || error.name === "ForbiddenError") {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async getAllUsers() {
        try {
            const response = await this.respository.getUsers();
            return response;
        } catch(error) {
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
        
    }

    async getRoleUnverifiedUsers() {
        try {
            const users = await this.respository.getRoleUnverifiedUsers();
            return users;
        } catch (error) {
            console.log("UserService: Error fetching unverified users", error);
            throw new InternalServerError();
        }
    }

    async getUser(userId) {
        try {
            const response = await this.respository.getUser(userId);
            if(!response) {
                // we were not able to find anything
                console.log("UserService: ", userId, "not found");
                throw new NotFoundError("User", "id", userId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
        
    }

    async destroyUser(userId) {
        try {
            const response = await this.respository.destroyUser(userId);
            if(!response) {
                // we were not able to find anything
                console.log("UserService: ", userId, "not found");
                throw new NotFoundError("User", "id", userId);
            }
            return response;
        } catch(error) {
            if(error.name === "NotFoundError") {
                throw error;
            }
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
        
    }

    async verifyUserRole(req) {
        try {
            var currentUser = req.user;
            const requestedUser = await this.respository.getUser(req.params.id);
            if (!requestedUser) {
                throw new NotFoundError("User", "id", req.params.id);
            }
            // current user should only be allowed to verify the requested user if his role is a direct ancestor of the requested role
            // if ( !isDirectAncestor(currentUser.roleId, requestedUser.roleId) ){
            //     throw new ForbiddenError('User.isRoleVerified', 'update', `You are not a direct ancestor of ${requestedUser.requestedRoleId}`);
            // }
            if (!requestedUser.isRoleVerified){
                const updatedUser = await this.respository.updateUser(requestedUser.id, { isRoleVerified: true });
                return updatedUser;
            }
            else{
                const updatedUser = await this.respository.updateUser(requestedUser.id, { isRoleVerified: false });
                return updatedUser;
            }
        } catch (error) {
            if (error.name === "NotFoundError" || error.name === "ForbiddenError") {
                throw error;
            }
            console.log("UserService: ", error);
            throw new InternalServerError();
        }
    }
    
}


module.exports = UserService;
