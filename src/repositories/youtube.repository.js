const youtube = require("scrape-yt");

/**
 * Youtube repository. 
 * Scrapes Youtube site looking for video URLs
 * 
 * 
 * @memberof module:repositories
 * @class YoutubeRepository
 */
class YoutubeRepository{
    /**
     * Gets info about an album
     * 
     * @function getVideo
     * @memberof module:repositories.YoutubeRepository
     * @this module:repositories.YoutubeRepository
     * @param {String} track - Name of the track to searh
     * @param {String} artist - Artist of the track
     * @param {String} [limit] - How many results to get, defaults to 1
     * @param {String} [type] - Type of the results, defaults to video
     * @requires scrape-yt
     * @returns {Object} - Object containing found video urls
     * @instance
     * @async
     */

    async getVideo(track, artist, limit = 10, type="video"){    
        const results = await youtube.search(artist + " " + track, {limit:limit, type: type});
        return results[0] ? results[0].id : "";
    }
}

module.exports = new YoutubeRepository();