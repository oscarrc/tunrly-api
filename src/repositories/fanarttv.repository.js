const {FANART_URL, FANART_KEY} = require('../../config');
const axios = require('axios');

class FanartTvRepository{
    constructor(FANART_URL, FANART_KEY){
        this.url = FANART_URL;
        this.key = FANART_KEY
    }

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