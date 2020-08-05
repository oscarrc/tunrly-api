/**
 * Data layer.
 * 
 * Defines data models as stored in the DB
 * @module models
 */

module.exports = {
    User: require('./user.model'),
    Playlist: require('./playlist.model'),
    Track: require('./track.model'),
    Album: require('./album.model'),
    Artist: require('./artist.model'),
    Validation: require('./validation.model'),
    Session: require('./session.model')
}