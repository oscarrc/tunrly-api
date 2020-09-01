/**
 * Middleware module
 * 
 * Functions passed to the request chain in order to realize some operations within it
 * @module middlewares
 */

module.exports = {
    AuthMiddleware: require('./auth.middleware'),
    CacheMiddleware: require('./cache.middleware'),
    ErrorMiddleware: require('./error.middleware'),
    LoggerMiddleware: require('./logger.middleware'),
    NotfoundMiddleware: require('./notfound.middleware')
}