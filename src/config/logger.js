// Central Winston logger. Replaces every console.log/console.error in the
// codebase so log output has consistent levels, timestamps, and is
// persisted to disk — not just scrollback in a terminal that closes.
const path = require('path');
const winston = require('winston');
const config = require('./index');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');

// Human-readable, colorized output for a developer's terminal.
const consoleFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => `${timestamp} [${level}]: ${stack || message}`)
);

// Structured JSON for the log files — easier to grep/parse or ship to a
// log aggregator later than a colorized string would be.
const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
);

const transports = [];

if (process.env.VERCEL || !config.isProduction) {
    transports.push(new winston.transports.Console({ format: consoleFormat }));
}

if (!process.env.VERCEL) {
    transports.push(
        new winston.transports.File({
            filename: path.join(LOGS_DIR, 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(LOGS_DIR, 'combined.log')
        })
    );
}

const logger = winston.createLogger({
    level: config.isProduction ? 'info' : 'debug',
    format: config.isProduction ? consoleFormat : fileFormat,
    transports
});

module.exports = logger;
