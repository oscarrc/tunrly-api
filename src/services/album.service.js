const BaseService = require("./base.service");
const { LastFmRepository } = require('../repositories');
const { Album } = require("../models");
const { ApiError } = require('../errors');
const { escapeString } = require('../helpers/regex.helper');
const TrackService = require('./track.service.js');

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
    constructor(Album, LastFM, TrackService){
        super(Album);
        this.album = Album;
        this.albumRepository = LastFM;
        this.trackService = TrackService;
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
    async formatAlbum(album, bulk){
        console.log(bulk)
        album = {
            name: album.name,
            mbid: album.mbid || null,
            url: album.url,
            artist: album.artist,
            tracks: bulk ? [] : await Promise.all(album.tracks.track.map( async t => {
                                    return this.trackService.getInfo(t.name, t.artist.name, true);
                                })),
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
    async getInfo(name, artist, bulk = false){
        let album = await this.album.findOne({
            "name": new RegExp('\\b' + escapeString(name) + '\\b', 'i'),
            "artist": new RegExp('\\b' + escapeString(artist) + '\\b', 'i')
        });

        if(!album || (!album.tracks.length && !bulk)){
            let lastFmData = await this.albumRepository.getAlbum('getInfo', name, artist);

            if(!lastFmData.album){
                if(!bulk){
                    throw new ApiError(7);
                }else{
                    return;
                }
            }
            
            if(!album){
                album = await this.formatAlbum(lastFmData.album, bulk);
            }else if(!album.tracks.length && !bulk){   
                album.tracks = await Promise.all(lastFmData.album.tracks.track.map( async t => {
                    return this.trackService.getInfo(t.name, t.artist.name, true);
                }))
            }
            
            album = album.save();
        }

        return album;
    }

    /**
     * Gets popular albums by tag
     * 
     * @function getByTag
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {String} tag - Tag to get top albums for
     * @param {Number} page - The page to fetch
     * @param {Number} limit - Results per page
     * @returns {Array.<module:models.album>} - Album array
     * @instance
     * @async
     */
    async getByTag(tag, page, limit){
        const data = await this.albumRepository.getTag('gettopalbums', tag, page, limit);            
        let albums = data.albums.album;

        albums = await Promise.all( albums.map( async (a) => {
            return await this.getInfo(a.name, a.artist.name, true);
        }))

        return albums;
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

        if(!search.results) return {}

        return {
            results: {
                query: search.results["@attr"]["for"],
                total: search.results["opensearch:totalResults"],
                page: search.results["opensearch:Query"]["startPage"],
                itemsPerPage: search.results["opensearch:itemsPerPage"]
            },
            matches: await Promise.all(search.results.albummatches.album.map( async a => {
                return this.getInfo(a.name, a.artist, true);
            }))
        }
    }
}

module.exports = new AlbumService(Album, LastFmRepository, TrackService)