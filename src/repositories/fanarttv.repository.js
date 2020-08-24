const {FANART_URL, FANART_KEY} = require('../../config');
const axios = require('axios');

/**
 * FanartTV repository. 
 * Interfaces with FanartTV API to get images
 * 
 * 
 * @memberof module:repositories
 * @class LastFmRepository
 * @param {String} url - Url of the API
 * @param {String}  key - FanartTV API Key
 */

class FanartTvRepository{
    constructor(url, key){
        this.url = url;
        this.key = key
    }

    /**
     * Gets image for given format (method) and mbid
     * 
     * @function getImage
     * @memberof module:repositories.FanartTvRepository
     * @this module:repositories.FanartTvRepository
     * @param {String} mbid - MBID of the artist or album
     * @param {String} method - Method to call, regarding what info we want to get
     * @returns {Object} - Object containing the matching images
     * @throws {Object} - Object detailing the error
     * @instance
     * @async
     */
    async getImage(mbid, method){
        const url = FANART_URL + ( method !== 'artist' ? '/' + method : '/') + mbid + '?api_key=' + this.key;

        const image = await axios.get( url ).then( (res) => {
            return res.data
        }).catch( (err) => {
            return err.data
        });

        return image;
    }
}

module.exports = new FanartTvRepository(FANART_URL, FANART_KEY);