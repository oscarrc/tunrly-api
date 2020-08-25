const lyrics = require("azlyrics-scraper");

/**
 * Lyrics repository. 
 * Scrapes AZLyrics to get track lyrics
 * 
 * 
 * @memberof module:repositories
 * @class LyricsRepository 
 */
class LyricsRepository{
    /**
     * Looks for track's lyrics
     * 
     * @function getLyrics
     * @memberof module:repositories.LyricsRepository
     * @this module:repositories.LyricsRepository
     * @param {String} track - Name of the track
     * @param {String} artist - Name of the artist
     * @returns {String} - An HTML string with the lyrics or a message if lyrics not found
     * @requires azlyrics-scraper
     * @instance
     * @async
     */

    async getLyrics(track, artist){
        return await lyrics.getLyric(`${artist} - ${track}`).then( (lyrics) => {
            return "<p>" + lyrics.join("</p><p>") + "</p>";
        }).catch( () => {
            return "<p>No lyrics found</p>";
        });
    }
}

module.exports = new LyricsRepository();