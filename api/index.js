try {
  const app = require('../src/app');
  const { connectDB } = require('../src/db/db');
  connectDB();
  module.exports = app;
} catch (err) {
  console.error('App load failed:', err.message, err.stack);
  module.exports = (req, res) => {
    res.status(500).json({ error: err.message, stack: process.env.VERCEL ? undefined : err.stack });
  };
}
