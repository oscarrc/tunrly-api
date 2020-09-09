/**
 * Data access layer.
 * 
 * Used to acces data from 3rd party APIS
 * @module repositories
 */

 //TODO add Musicbrainz repository to get artists' MBID
 //http://musicbrainz.org/ws/2/artist/?query=drake&fmt=json

module.exports = {
    FanartTvRepository: require('./fanarttv.repository'),
    LastFmRepository: require('./lastfm.repository'),
    LyricsRepository: require('./lyrics.repository'),
    MusicbrainzRepository: require('./musicbrainz.repository'),
    YoutubeRepository: require('./youtube.repository')
}