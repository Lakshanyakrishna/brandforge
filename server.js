const config = require('./src/config');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const logger = require('./src/config/logger');

const startServer = async () => {
    await connectDB();
    app.listen(config.port, () => {
        logger.info(`Server is running on port ${config.port}`);
    });
}

startServer();
