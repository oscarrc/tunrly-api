const axios = require('axios');
const { MUSICBRAINZ_URL } = require('../../config');

/**
 * MusicBrainz repository. 
 * Gets MBID for artists without one
 * 
 * 
 * @memberof module:repositories
 * @class YoutubeReMusicbrainzRepositorypository
 */
class MusicbrainzRepository{
    constructor(url){
        this.url = url;
    }

    /**
     * Gets artist MBID
     * 
     * @function getArtist
     * @memberof module:repositories.MusicbrainzRepository
     * @this module:repositories.MusicbrainzRepository
     * @param {String} name - Name of the artist
     * @returns {String} - The MBID for the artist
     * @instance
     * @async
     */

    async getArtist(name){    
        const mbid = await axios.get( this.url + '/artist', {params: { query: name }}).then( (res) => {
            return res.data
        }).catch( (err) => {
            return err.data
        });

        return mbid.artists[0].id || null
    }
}

module.exports = new MusicbrainzRepository(MUSICBRAINZ_URL);