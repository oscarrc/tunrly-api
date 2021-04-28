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
    DonationRoutes: require('./donation.routes'),
    HomeRoutes: require('./home.routes'),
    PlaylistRoutes: require('./playlist.routes'),
    SearchRoutes: require('./search.routes'),
    TagRoutes: require('./tag.routes'),
    TrackRoutes: require('./track.routes'),
    UserRoutes: require('./user.routes'),
    ValidationRoutes: require('./validation.routes')
}