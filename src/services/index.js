/**
 * Bussiness logic layer.
 * 
 * Performs all API operations and comunicates with repositories to get/put data from/to the database or third party APIs.
 * @module services
 */

module.exports = {
    AuthService: require('./auth.service'),
    HomeService: require('./home.service'),
    MailService: require('./mail.service'),
    UserService: require('./user.service'),
    ValidationService: require('./validation.service')
}