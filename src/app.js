const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const sanitizeMiddleware = require('./middlewares/sanitize.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const brandKitRoutes = require('./routes/brandKit.routes');
const designRoutes = require('./routes/design.routes');



const app = express();
app.set('trust proxy', 1);

// helmet sets a battery of protective headers (HSTS, X-Content-Type-Options,
// X-Frame-Options, etc). Its default Content-Security-Policy is disabled
// here specifically because it blocks Swagger UI's bundled inline script
// (window.ui = SwaggerUIBundle(...)) at /api/docs — every other helmet
// protection stays on. If /api/docs is removed from a deployment later,
// the default CSP can safely be re-enabled.
app.use(helmet({ contentSecurityPolicy: false }));

// credentials: true is required because auth uses an httpOnly cookie,
// not an Authorization header — the browser will only send the cookie
// cross-origin if the frontend is an explicitly allowed origin.
app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));

// HTTP request logging piped into Winston instead of straight to stdout,
// so request logs land in the same files/format as application logs.
// Logged at 'info' (not the lower-priority 'http' level) so requests are
// never silently dropped by the logger's production-mode 'info' floor.
app.use(morgan(config.isProduction ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) }
}));

// Global rate limit: a coarse ceiling against abusive traffic on the whole API.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(apiLimiter);

// Tighter limit specifically on auth: register/login are the classic
// brute-force/credential-stuffing target and deserve a stricter ceiling
// than general API traffic.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

app.use(express.json());
app.use(cookieParser());

// hpp strips duplicate query-string keys (e.g. ?id=1&id=2) down to a single
// value, preventing parameter-pollution based bypasses of validation/logic
// that assumes a single scalar value per key.
app.use(hpp());

// Sanitizes req.body/req.query strings against XSS payloads — see
// sanitize.middleware.js for why this isn't the (unmaintained) xss-clean.
app.use(sanitizeMiddleware);


//base url

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/brandkits',brandKitRoutes);
app.use('/api', designRoutes); // exposes POST /api/generate, GET /api/designs, DELETE /api/designs/:id

if (config.isProduction) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Must be registered last: unmatched routes fall through to notFound,
// and any error thrown/forwarded anywhere above lands in errorMiddleware.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
