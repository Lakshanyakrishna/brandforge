const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../config/logger');

let dbConnected = false;

function isDbConnected() {
    return dbConnected;
}

const connectDB = async () => {
    if (config.isProduction) {
        try {
            await mongoose.connect(config.mongoUri, {
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                serverSelectionTimeoutMS: 10000
            });
            dbConnected = true;
            logger.info("Connected to MongoDB");
        } catch (err) {
            logger.error(`MongoDB connection failed (non-fatal): ${err.message}`);
            logger.warn('Server will run without database. Set MONGO_URI to a valid MongoDB Atlas connection string.');
        }
    } else {
        await mongoose.connect(config.mongoUri, {
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000
        });
        dbConnected = true;
        logger.info("Connected to MongoDB");
    }
}

module.exports = { connectDB, isDbConnected };

module.exports = connectDB;