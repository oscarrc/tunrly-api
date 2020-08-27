const BaseService = require("./base.service");
const { LastFmRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Album } = require("../models");

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

    //TODO Get info about the album tracks

    /**
     * Gets info about an artist
     * 
     * @function formatArtist
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {Object} artist - An album as retrieved from Last FM API
     * @returns {module:models.artist} - The album fromatted as Album Model
     * @async
     */
    async formatModel(album){
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
     * @returns {module:models.user} - The found user
     * @instance
     * @async
     */
    async getInfo(name, artist){
        let album = await this.album.findOne({
            "name": new RegExp('\\b' + name + '\\b', 'i'),
            "artist": new RegExp('\\b' + artist + '\\b', 'i')
        });

        if(!album){
            let lastFmData = await this.albumRepository.getAlbum('getInfo', name, artist);

            if(!lastFmData.album){
                throw new ApiError(7);
            }

            album = await this.formatModel(lastFmData.album);
            album.save();
        }

        return album;
    }
}

module.exports = new AlbumService(Album, LastFmRepository)