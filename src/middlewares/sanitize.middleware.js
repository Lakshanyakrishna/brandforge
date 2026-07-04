// XSS sanitization for incoming request data.
//
// The once-standard `xss-clean` package is unmaintained (no updates since
// 2020) and wraps an even older, deprecated filter library, so it is
// deliberately not used here. Instead this is a small, explicit middleware
// built on `xss` (actively maintained, the same primitive many current
// sanitization middlewares wrap), applied to every string in req.body and
// req.query.
//
// This matters beyond today's JSON responses: free-text fields like
// BrandKit's brandName/toneOfVoice — and, starting in Stage 2, the user's
// design prompt — will eventually be interpolated into a server-rendered
// HTML template for PNG generation. Sanitizing at the API boundary means
// that path can never receive raw <script>/<img onerror> payloads.
const xss = require('xss');

function sanitizeValue(value) {
    if (typeof value === 'string') {
        return xss(value);
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = sanitizeValue(value[key]);
            return acc;
        }, {});
    }
    return value;
}

function sanitizeMiddleware(req, res, next) {
    if (req.body) {
        req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        Object.keys(req.query).forEach((key) => {
            req.query[key] = sanitizeValue(req.query[key]);
        });
    }
    next();
}

module.exports = sanitizeMiddleware;
