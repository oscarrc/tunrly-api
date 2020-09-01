const BaseService = require("./base.service");
const { LastFmRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Album } = require("../models");
const { escapeString } = require('../helpers/regex.helper');

/**
 * Bussiness logic for Album management
 * 
 * @class AlbumService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.Album} Album - album model
 * @param {module:repositories.LastFmRepository} LastFM - Repo to fetch album in case it doesn't exist in the DB yet.
 */

class AlbumService extends BaseService{
    constructor(Album, LastFM, FanartTV){
        super(Album);
        this.album = Album;
        this.albumRepository = LastFM;
    }

    /**
     * Formats album as Album Model
     * 
     * @function formatAlbum
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {Object} artist - An album as retrieved from Last FM API
     * @returns {module:models.artist} - The album fromatted as Album Model
     * @async
     */
    async formatAlbum(album){
        album = {
            name: album.name,
            mbid: album.mbid || null,
            url: album.url,
            artist: album.artist,
            tracks: album.tracks.track.map( (t) => { return {name: t.name, artist: t.artist.name} } ),
            image: album.image.map( (i) => { return i["#text"] }),
            tags: album.tags.tag.map( (t) => { return t["name"] }),
            wiki: album.wiki
        }

        return new this.album(album);
    }

    /**
     * Gets info about an album
     * 
     * @function getInfo
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {String} name - The name of the album to get
     * @returns {module:models.album} - The found user
     * @instance
     * @async
     */
    async getInfo(name, artist){
        let album = await this.album.findOne({
            "name": new RegExp('\\b' + escapeString(name) + '\\b', 'i'),
            "artist": new RegExp('\\b' + escapeString(artist) + '\\b', 'i')
        });

        if(!album){
            let lastFmData = await this.albumRepository.getAlbum('getInfo', name, artist);

            if(!lastFmData.album){
                throw new ApiError(7);
            }

            album = await this.formatAlbum(lastFmData.album);
        }

        return album.save();
    }

    /**
     * Search for an album
     * 
     * @function search
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {String} query - search string
     * @returns {Object} - An object containing info abut the number of results and an array of albums
     * @instance
     * @async
     */
    async search(query, page, limit){
        let search = await this.albumRepository.search('album', query, page, limit);

        return {
            results: {
                query: search.results["@attr"]["for"],
                total: search.results["opensearch:totalResults"],
                page: search.results["opensearch:Query"]["startPage"],
                itemsPerPage: search.results["opensearch:itemsPerPage"]
            },
            matches: await Promise.all(search.results.albummatches.album.map( async a => {
                return this.getInfo(a.name, a.artist);
            }))
        }
    }
}

module.exports = new AlbumService(Album, LastFmRepository)