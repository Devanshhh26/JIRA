const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require("dotenv");
dotenv.config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};



const authorize = (roles = []) => {           // takes the input of roles which are allowed to access the route from the routes
    // Convert single role string to an array for flexibility
    if (typeof roles === 'string') {
        roles = [roles];                    
    }

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {       // if the role which we got from the route is not the same as the role of the user
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next(); // User has required role
    };
};

module.exports = { authorize,authenticate };
