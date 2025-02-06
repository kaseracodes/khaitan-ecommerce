const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PASS: process.env.DB_PASS,
    DB_ALTER: typeof process.env.DB_ALTER === 'boolean' ? process.env.DB_ALTER : (process.env.DB_ALTER === 'true'),
    DB_FORCE: typeof process.env.DB_FORCE === 'boolean' ? process.env.DB_FORCE : (process.env.DB_FORCE === 'true'),
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    NODE_ENV: process.env.NODE_ENV
}