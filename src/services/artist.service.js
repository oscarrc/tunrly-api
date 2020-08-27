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
     * @returns {module:models.user} - The found user
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

            artist = await this.formatModel(lastFmData.artist);
            artist.save();
        }

        return artist;
    }

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
}

module.exports = new ArtistService(Artist, LastFmRepository, FanartTvRepository)