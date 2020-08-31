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

    /**
     * Formats artist as artist model
     * 
     * @function formatArtist
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {Object} artist - An artist as retrieved from Last FM API
     * @returns {module:models.artist} - The artist fromatted as Artist Model
     * @async
     */
    async formatArtist(artist){
        artist = {
            name: artist.name,
            mbid: artist.mbid || null,
            url: artist.url,
            image: null,
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
     * @returns {module:models.artist} - The artist
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getInfo(name){
        let artist = await this.artist.findOne({"name": new RegExp('\\b' + name + '\\b', 'i')});

        if(!artist){
            let lastFmData = await this.artistRepository.getArtist('getinfo', name);

            if(!lastFmData.artist){
                throw new ApiError(8);
            }

            artist = await this.formatArtist(lastFmData.artist);
            artist.save();
        }

        return artist;
    }

    /**
     * Gets top albums for the artist
     * 
     * @function getAlbums
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {module:models.artist} - The artist with top albums added
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getAlbums(id){
        let artist = await this.artist.findById(id);

        if(!artist){
            throw new ApiError(8);
        }

        if(!artist.albums || artist.albums.length === 0){
            const albums = await this.artistRepository.getArtist('getTopAlbums',artist.name);

            if(albums.topalbums.album){
                artist.albums = albums.topalbums.album.map( (a) => {
                    return {
                        name: a.name,
                        image: (a.image.pop())["#text"]
                    };
                 });

                artist.save();
            }
        }

        return artist;
    }

    /**
     * Gets top tracks for the artist
     * 
     * @function getTracks
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {module:models.artist} - The artist with top tracks added
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getTracks(id){
        let artist = await this.artist.findById(id);

        if(!artist){
            throw new ApiError(8);
        }

        if(!artist.albums || artist.albums.length === 0){
            const tracks = await this.artistRepository.getArtist('getTopTracks',artist.name);

            if(tracks.toptracks.track){
                artist.tracks = tracks.toptracks.track.map( (t) => {
                    return {
                        name: t.name,
                        image: (t.image.pop())["#text"]
                    };
                });

                artist.save();
            }
        }
        
        return artist;
    }

    /**
     * Gets similar artist
     * 
     * @function getSimilar
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {module:models.artist} - The artist with similar artists added
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getSimilar(id){
        let artist = await this.artist.findById(id);

        if(!artist){
            throw new ApiError(8);
        }
       
        if(!artist.similar || artist.similar.length === 0){
            const similar = await this.artistRepository.getArtist('getsimilar',artist.name);

            if(similar.similarartists.artist){
                let similarArtists = await Promise.all( similar.similarartists.artist.map( async (artist) => {
                    
                    if (artist.mbid){
                        const image = await this.imageRepository.getImage(artist.mbid, 'artist');
                        artist.image = image && image.artistthumb ? image.artistthumb[0].url : null;
                    }else{
                        artist.image = null;
                    }
                    
                    return {
                        name: artist.name,
                        image: artist.image
                    }
                }));

                artist.similar = similarArtists;
                artist.save();
            }
        }

        return artist;
    }

    /**
     * Gets top artists
     * 
     * @function getTop
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} country - 2 character country code to fetch artists for
     * @param {String} page - page to fetch
     * @param {String} limit - items per page
     * @returns {Array.<module:models.artist>} - An array of popular artists
     * @instance
     * @async
     */
    async getTop(country, page, limit){
        let result;
        let formatted = [];

        if(country){
            const data = await this.artistRepository.getGeo('getTopArtists', country, page, limit);            
            result = data.topartists.artist;
        }else{
            const data = await this.artistRepository.getChart('getTopArtists', page, limit);
            result = data.artists.artist;
        }

        for( let r of result){
            let album = await this.getInfo(r.name);
            formatted.push(album);
        }

        return formatted;
    }
}

module.exports = new ArtistService(Artist, LastFmRepository, FanartTvRepository)