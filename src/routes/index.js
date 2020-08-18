/**
 * Routing layer
 * 
 * Connects endpoints with its respective controller functions
 * @module routes
 */

module.exports = {
    AuthRoutes: require('./auth.routes'),
    HomeRoutes: require('./home.routes'),
    UserRoutes: require('./user.routes'),
    ValidationRoutes: require('./validation.routes')
}