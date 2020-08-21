/**
 * Routing layer
 * 
 * Connects endpoints with its respective controller functions
 * @module routes
 */

module.exports = {
    AlbumRoutes: require('./album.routes'),
    ArtistRoutes: require('./artist.routes'),
    AuthRoutes: require('./auth.routes'),
    HomeRoutes: require('./home.routes'),
    TrackRoutes: require('./track.routes'),
    UserRoutes: require('./user.routes'),
    ValidationRoutes: require('./validation.routes')
}