const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '1h', // tempo de expiração do token
};
