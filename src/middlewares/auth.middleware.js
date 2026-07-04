const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const multer = require('multer');
const config = require('../config');

async function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await userModel.findOne({
            _id: decoded.userId
        });
        
        req.user = user;
        req.userId = user._id;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token, please login again"
        });
    }
}

   



module.exports = authMiddleware;