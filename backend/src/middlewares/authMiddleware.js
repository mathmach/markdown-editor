const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token.split(' ')[1], jwtConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id; 
        next();
    });
};

module.exports = verifyToken;
