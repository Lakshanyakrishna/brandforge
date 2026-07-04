// Single source of truth for environment configuration. No other file in
// this codebase should read process.env directly — every value the app
// needs is read once here, validated, and re-exported as a plain object.
// This makes it possible to see every config dependency the app has by
// reading one file, and to fail fast at boot instead of hitting an
// "undefined is not a valid X" error deep inside a request later.
require('dotenv').config();

const REQUIRED_ENV_VARS = [
    'MONGO_URI',
    'JWT_SECRET',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT',
    'GEMINI_API_KEY'
];

function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        // Logger isn't safe to use here yet (it may itself depend on config
        // in the future), so this uses console directly as a last resort —
        // the only place in the codebase allowed to do so.
        console.error(
            `Startup aborted — missing required environment variable(s): ${missing.join(', ')}. ` +
            'Copy .env.example to .env and fill in real values.'
        );
        process.exit(1);
    }
}

validateEnv();

const config = {
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 5000,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,

    imagekit: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    },

    gemini: {
        apiKey: process.env.GEMINI_API_KEY
    }
};

module.exports = config;
