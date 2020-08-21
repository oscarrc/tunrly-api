/**
 * Controllers
 * 
 * Called by router in order to fullfill the requests
 * @module controllers
 */

module.exports = {
    ArtistController: require('./artist.controller'),
    AuthController: require('./auth.controller'),
    HomeController: require('./home.controller'),
    UserController: require('./user.controller'),
    ValidationController: require('./validation.controller')
}