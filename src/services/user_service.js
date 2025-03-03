const bcrypt = require('bcrypt');

const BadRequest = require("../errors/bad_request_error");
const ConflictError = require("../errors/conflict_error");
const InternalServerError = require("../errors/internal_server_error");
const NotFoundError = require("../errors/not_found_error");
const ForbiddenError = require("../errors/forbidden_error");
const UnauthorizedError = require("../errors/unauthorized_error");

const { generateJWT, verifyToken } = require("../utils/auth");
const { SALT_ROUNDS } = require("../config/server_config");
const otpCache = require("../cache/otp_cache");

class UserService {

    constructor(respository, cartRepository) {
        this.respository = respository;
        this.cartRepository = cartRepository;
    }


    async createUser(user) {
        try {
            const response = await this.respository.createUser(user.email, user.password, user.name, user.phoneNumber, user.roleId);
            await this.cartRepository.createCart(response.id);
            otpCache.createOTP(response.id);
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
            if(!user.isUserVerified){
                if(user.roleId == 1) {
                    throw new ForbiddenError('User Website', 'signin', 'User unverified');
                } else {
                    throw new ForbiddenError('Admin Panel', 'sigin', 'User unverified');
                }
            }
            // roleId 1 corresponds to a normal user.
            if((user.roleId != 1) && (!user.isRoleVerified)){
                throw new ForbiddenError('Admin Panel', 'signin', 'Role unverified')
            }

            const token = generateJWT({
                email: user.email, 
                id: user.id, 
                roleId: user.roleId
            });

            const userDetails = await this.getUser(user.id);

            return {
                user: userDetails,
                token
            };

        } catch(error) {
            console.log("UserService: ",error);
            if(error.name === "NotFoundError" || error.name === "UnauthorizedError" || error.name === "ForbiddenError") {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async getRegularUsers() {
        try {
            const response = await this.respository.getRegularUsers();
            return response;
        } catch(error) {
            console.log("UserService: Error fetching regular users",error);
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

    async getAdminUsers() {
        try {
            const admins = await this.respository.getAdminUsers();
            return admins;
        } catch (error) {
            console.log("UserService: Error fetching admin users", error);
            throw error;
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

    async updateUserDetails(userId, data) {
        try {
            const { name } = data;

            const response = await this.respository.updateUserDetails(userId, name);
            if(!response) {
                // we were not able to find anything
                console.log("UserService: ", userId, "not found");
                throw new NotFoundError("User", "id", userId);
            }
            return response;
        } catch (error) {
            if(error.name === "NotFoundError" || error.name === "UnauthorizedError" || error.name === "ForbiddenError") {
                throw error;
            }
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
    }

    async forgotPassword(userId) {
        try {
            const user = await this.respository.getUser(userId);

            if (!user) {
                throw new NotFoundError("User", "id", userId);
            }

            const token = generateJWT({id: userId, type: 'password-reset'});

            console.log(token);

            return token;
        } catch(error) {
            if(error.name === "NotFoundError" || error.name === "UnauthorizedError" || error.name === "ForbiddenError") {
                throw error;
            }
            console.log("UserService: ",error);
            throw new InternalServerError();
        }
    }

    async resetPassword(userId, data) {
        try {
            const { token, newPassword } = data;        

            const payload = verifyToken(token);
    
            if (payload.type !== 'password-reset') {
                throw new UnauthorizedError("Invalid token type");
            }
    
            // Optional: Verify that the userId from the URL matches the token's id.
            if (userId != payload.id) {
                throw new UnauthorizedError("User ID mismatch");
            }
    
            const user = await this.respository.getUser(userId);
            if (!user) {
                throw new NotFoundError("User", "id", userId);
            }

            const salt = await bcrypt.genSalt(+SALT_ROUNDS);
            const encryptedNewPassword = await bcrypt.hash(newPassword, salt);
    
            await this.respository.updateUser(userId, { password: encryptedNewPassword });
        } catch (error) {
            console.log("UserService: ",error);
            if (error.name === "NotFoundError" || error.name === "ForbiddenError") {
                throw error;
            }
            if (error.name === "UnauthorizedError") {
                throw new UnauthorizedError("Invalid Token.");
            }
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

    async verifyUserOTP(req) {
        try {
            const requestedUser = await this.respository.getUser(req.params.id);
            if (!requestedUser) {
                throw new NotFoundError("User", "id", req.params.id);
            }
            const { otp } = req.body;
            console.log(req.body);
            const isValid = otpCache.validateOTP(req.params.id, otp);
            if (isValid == false) {
                throw new ForbiddenError("Profile","Login","Invalid OTP provided.");
            }
            const updatedUser = await this.respository.updateUser(requestedUser.id, { isUserVerified: true });
            return updatedUser;
        } catch (error) {
            console.log("UserService: Error verifying OTP", error);
            if (error.name === "NotFoundError" || error.name === "ForbiddenError") {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async resendUserOTP(req) {
        try {
            const newOtp = otpCache.createOTP(req.params.id);

            console.log(`New OTP Created for User ${req.params.id}: ${newOtp}`);
        } catch (error) {
            console.log("UserService: Error resending OTP", error);
            if (error.name === "NotFoundError" || error.name === "ForbiddenError") {
                throw error;
            }
            throw new InternalServerError();
        }
    }

    async changeUserRole(userId, newRoleId) {
        try {
            const updatedUser = await this.respository.updateUser(userId, { roleId: newRoleId, isRoleVerified: false });
            return updatedUser;
        } catch (error) {
            console.log("UserService: Error changing user role", error);
            if (error.name === "NotFoundError" ||  error.name === "ConflictError") {
                throw error;
            }
            throw new InternalServerError();
        }
    }
    
    
}


module.exports = UserService;
