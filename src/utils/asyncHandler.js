// Wraps an async route/middleware handler so any rejected promise is
// forwarded to next(err) instead of becoming an unhandled rejection,
// letting the centralized error middleware handle the response.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
