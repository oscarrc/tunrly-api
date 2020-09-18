const axios = require('axios');
const { LYRICS_URL } = require('../../config');

/**
 * Lyrics repository. 
 * Scrapes AZLyrics to get track lyrics
 * 
 * 
 * @memberof module:repositories
 * @class LyricsRepository 
 * @param {String} url - Url of the API
 */
class LyricsRepository{
    constructor(url){
        this.repositoryUrl = url;
    }
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
        const lyrics = await axios.get(`${this.repositoryUrl}/${artist}/${track}`).then( (res) => {
            return res.lyrics
        }).catch( (err) => {
            return err.error
        })
        
        return lyrics;
    }
}

module.exports = new LyricsRepository(LYRICS_URL);