const { connectDB } = require('../src/db/db');
const app = require('../src/app');
connectDB();
module.exports = app;
