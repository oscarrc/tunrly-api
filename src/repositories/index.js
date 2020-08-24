/**
 * Data access layer.
 * 
 * Used to acces data from 3rd party APIS
 * @module repositories
 */

module.exports = {
    FanartTvRepository: require('./fanarttv.repository'),
    LastFmRepository: require('./lastfm.repository'),
    LyricsRepository: require('./lyrics.repository'),
    YoutubeRepository: require('./youtube.repository')
}