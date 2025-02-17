const NodeCache = require('node-cache');
const generateOTP = require('../utils/otpGenerator');
const { OTP_TTL } = require('../config/server_config');

class OTPCache {
    constructor() {
        console.log("OTP Cache Queue instance created");
        this.otpCache = new NodeCache(
            { 
                stdTTL: parseInt(OTP_TTL) 
            }
        );
    }

    createOTP(userId) { 
        const otp = generateOTP();
        this.otpCache.set(userId, otp);
        console.log(`OTP created for ${userId}: ${otp}`);
        console.log(`OTP for user ${userId} stored in cache:`, this.otpCache.get(userId));
        return otp;
    }

    validateOTP(userId, otp) {
        try {
            const storedOtp = this.otpCache.get(userId);
            console.log(`Stored OTP for ${userId}: ${storedOtp}, OTP being validated: ${otp}`);
            if (storedOtp && storedOtp == otp) {
                console.log(`OTP validated successfully for user ${userId}`);
                this.otpCache.del(userId);
                return true;
            }
        } catch (error) {
            console.log(`OTP validation failed for user ${userId}`);
            return false;
        }
        
    }
    

    deleteOTP(userId) {
        if (this.otpCache.del(userId)) {
            console.log(`OTP deleted for user ${userId}`);
            return true;
        }
        console.log(`No OTP found for user ${userId}`);
        return false;
    }
}

module.exports = new OTPCache();