/**
 * Bussiness logic layer.
 * 
 * Performs all API operations and comunicates with repositories to get/put data from/to the database or third party APIs.
 * @module services
 */

module.exports = {
    AlbumService: require('./album.service'),
    ArtistService: require('./artist.service'),
    AuthService: require('./auth.service'),
    HomeService: require('./home.service'),
    MailService: require('./mail.service'),
    TrackService: require('./track.service'),
    UserService: require('./user.service'),
    ValidationService: require('./validation.service')
}