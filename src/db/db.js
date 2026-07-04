const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../config/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000
        });
        logger.info("Connected to MongoDB");
    } catch (err) {
        logger.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;