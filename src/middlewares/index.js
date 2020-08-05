/**
 * Middleware module
 * 
 * Functions passed to the request chain in order to realize some operations within it
 * @module middlewares
 */

module.exports = {
    AuthMiddleware: require('./auth.middleware')
}