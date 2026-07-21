process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT:', err.message, err.stack);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED:', err.message, err.stack);
});

let app;
try {
  app = require('./src/app');
} catch (err) {
  console.error('APP LOAD FAILED:', err.message, err.stack);
  app = require('express')();
  app.all('*', (req, res) => res.status(500).json({ error: err.message }));
}

const { connectDB } = require('./src/db/db');

if (!process.env.VERCEL) {
  const config = require('./src/config');
  const logger = require('./src/config/logger');
  const startServer = async () => {
      await connectDB();
      app.listen(config.port, () => {
          logger.info(`Server is running on port ${config.port}`);
      });
  }
  startServer();
} else {
  connectDB();
}

module.exports = app;
