const BaseService = require("./base.service");
const { LastFmRepository, FanartTvRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Artist } = require("../models");

/**
 * Bussiness logic for Artist management
 * 
 * @class ArtistService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.Artist} Artist - Artist model
 * @param {module:repositories.LastFmRepository} LastFM - Repo to fetch artist in case it doesn't exist in the DB yet.
 * @param {module:repositories.FanartTvRepository} FanartTV - Repo to fetch artist images
 */

class ArtistService extends BaseService{
    constructor(Artist, LastFM, FanartTV){
        super(Artist);
        this.artist = Artist;
        this.artistRepository = LastFM;
        this.imageRepository = FanartTV;
    }

    //TODO Get popular tracks and albums for the artist
    //TODO Get info about related artists

    /**
     * Gets info about an artist
     * 
     * @function formatArtist
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {Object} artist - An artist as retrieved from Last FM API
     * @returns {module:models.artist} - The artist fromatted as Artist Model
     * @async
     */
    async formatModel(artist){
        artist = {
            name: artist.name,
            mbid: artist.mbid || null,
            url: artist.url,
            similar: artist.similar.artist.map( (a)=> { return { name: a.name } }),
            tags: artist.tags.tag.map( (t) => { return t["name"] }),
            wiki: {
                published: artist.bio.published,
                summary: artist.bio.summary,
                content: artist.bio.content,
            }
        }
        
        if(artist.mbid){
            const image = await this.imageRepository.getImage(artist.mbid, 'artist');
            artist.image = {
                background: image && image.artistbackground ? image.artistbackground.map( (b) => { return b.url }) : [],
                thumbnail: image && image.artistthumb ? image.artistthumb.map( (t) => { return t.url }) : [],
                logo: image && image.musiclogo ? image.musiclogo.map( (l) => { return l.url }) : []
            };
        }
        return new this.artist(artist);
    }

    /**
     * Gets info about an artist
     * 
     * @function getInfo
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} name - The name of the artist to get
     * @returns {module:models.user} - The found user
     * @instance
     * @async
     */
    async getInfo(name){
        let artist = await this.artist.findOne({"name": new RegExp('\\b' + name + '\\b', 'i')});

        if(!artist){
            let lastFmData = await this.artistRepository.getArtist('getinfo', name);
            artist = await this.formatModel(lastFmData.artist);
            artist.save();
        }

        return artist;
    }
}

module.exports = new ArtistService(Artist, LastFmRepository, FanartTvRepository)