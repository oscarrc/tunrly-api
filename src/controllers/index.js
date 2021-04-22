/**
 * Controllers
 * 
 * Called by router in order to fullfill the requests
 * @module controllers
 */

module.exports = {
    AlbumController: require('./album.controller'),
    ArtistController: require('./artist.controller'),
    AuthController: require('./auth.controller'),
    DonationController: require('./donation.controller'),
    HomeController: require('./home.controller'),
    PlaylistController: require('./playlist.controller'),
    SearchController: require('./search.controller'),
    TagController: require('./tag.controller'),
    TrackController: require('./track.controller'),
    UserController: require('./user.controller'),
    ValidationController: require('./validation.controller')
}