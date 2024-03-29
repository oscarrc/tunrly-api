const BaseService = require("./base.service");
const TrackService = require('./track.service.js');
const AlbumService = require('./album.service');

const { LastFmRepository, FanartTvRepository, MusicbrainzRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Artist } = require("../models");
const { escapeString } = require('../helpers/regex.helper');

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
    constructor(Artist, LastFM, FanartTV, Musicbrainz, TrackService, AlbumService){
        super(Artist);
        this.artist = Artist;
        this.artistRepository = LastFM;
        this.imageRepository = FanartTV;
        this.musicbrainzRepository = Musicbrainz      
        this.albumService = AlbumService
        this.trackService = TrackService;
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
            image: await this.getImage(artist),
            tags: Array.isArray(artist.tags.tag) ? artist.tags.tag.map( (t) => { return t["name"] }) : [],
            wiki: {
                published: artist.bio?.published || '',
                summary: artist.bio?.summary || '',
                content: artist.bio?.content || '',
            }
        }

        return new this.artist(artist);
    }

     /**
     * Gets images for an artist
     * 
     * @function getImage
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {Object} artist - An artist as retrieved from Last FM API
     * @returns {module:models.artist.image} - The object with artist's images
     * @async
     */
    async getImage(artist){
        let image;
        artist.mbid = artist.mbid ? artist.mbid : await this.musicbrainzRepository.getArtist(artist.name);        
        
        if(artist.mbid){
            image = await this.imageRepository.getImage(artist.mbid, 'artist');
            image = image ? {
                background: image && image.artistbackground ? image.artistbackground.map( (b) => { return b.url }) : [],
                thumbnail: image && image.artistthumb ? image.artistthumb.map( (t) => { return t.url }) : [],
                logo: image && image.musiclogo ? image.musiclogo.map( (l) => { return l.url }) : []
            } : {};
        }

        return image;
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
    async getInfo(name, bulk = false){
        let artist;
        const projection = {
            albums: { $slice: [ 0, 12 ] },
            tracks: { $slice: [ 0, 12 ] },
            similar: { $slice: [ 0, 12 ] }
        }
        
        if(bulk){
            artist = await this.artist.findOne({"name": escapeString(name)}, projection)
        }else{
            artist = await this.artist.findOne({"name": escapeString(name)}, projection)
                                        .populate('tracks')
                                        .populate('albums')
                                        .populate('similar')
        }

        if(!artist){
            let lastFmData = await this.artistRepository.getArtist('getinfo', name);

            if(!lastFmData || !lastFmData.artist){
                if(!bulk){
                    throw new ApiError(8);
                }else{
                    return;
                }
            }

            artist = await this.formatArtist(lastFmData.artist);
            artist = await artist.save();
        }
        
        if(!artist.image.thumbnail.length) {
            artist.image = await this.getImage(artist)
            artist = await artist.save();
        }

        return artist;
    }

    /**
     * Gets popular artists by tag
     * 
     * @function getByTag
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} tag - Tag to get top artists for
     * @param {Number} page - The page to fetch
     * @param {Number} limit - Results per page
     * @returns {Array.<module:models.artist>} - Artist array
     * @instance
     * @async
     */
    async getByTag(tag, page, limit){
        const data = await this.artistRepository.getTag('gettopartists', tag, page, limit);            
        let artists = data.topartists.artist;

        artists = await Promise.all( artists.map( async (a) => {
            return await this.getInfo(a.name, true);
        }))

        return artists;
    }

    /**
     * Gets top albums for the artist
     * 
     * @function getAlbums
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {Array} - An array of artist albums
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getAlbums(id, page=1, limit=12){
        let artist = await this.artist.findById(id, { albums: { $slice: [ (page - 1)*limit, parseInt(limit) ] } }).populate({path:'albums'});
        let albums;
       
        if(!artist){
            throw new ApiError(8);
        }

        if(!artist.albums || artist.albums.length === 0 || artist.albums.length < limit ){
            albums = await this.artistRepository.getArtist('getTopAlbums', artist.name, page, limit);

            if(albums.topalbums.album){
                albums = await Promise.all(albums.topalbums.album.map( async (a) => {
                    let album = await this.albumService.getInfo(a.name, a.artist.name, true);

                    if(!album) return;

                    return album;
                 }), this)
                
                albums.forEach( a => artist.albums.addToSet(a._id));
                artist.save();
            }
        }else{
            albums = artist.albums;
        }
        
        return albums;
    }

    /**
     * Gets top tracks for the artist
     * 
     * @function getTracks
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {Array} - An array of artist tracks
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getTracks(id, page=1, limit=10){
        let artist = await this.artist.findById(id, { tracks: { $slice: [ (page - 1)*limit, parseInt(limit) ] } }).populate({path:'tracks'});;
        let tracks;
        
        if(!artist){
            throw new ApiError(8);
        }

        if(!artist.tracks || artist.tracks.length === 0 || artist.tracks.length < limit){
            tracks = await this.artistRepository.getArtist('getTopTracks',artist.name,page,limit);
            
            if(tracks.toptracks.track){
                tracks = await Promise.all(tracks.toptracks.track.map( async (t) => {                    
                    let track = await this.trackService.getInfo(t.name, t.artist.name, true);

                    if(!track) return;

                    return track;
                }), this);
               
                tracks.forEach( t => artist.tracks.addToSet(t._id) );                
                artist.save();
            }
        }else{
            tracks = artist.tracks;
        }
        
        return tracks;
    }

    /**
     * Gets similar artist
     * 
     * @function getSimilar
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} id - Id of the artist
     * @returns {Array} - An array of similar artists
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getSimilar(id, page=1, limit=12){
        let artist = await this.artist.findById(id, { similar: { $slice: [ (page - 1)*limit, parseInt(limit) ] } }).populate({path:'similar'});
        let similar;

        if(!artist){
            throw new ApiError(8);
        }
       
        if(!artist.similar || artist.similar.length === 0 || artist.similar.length < limit){
            similar = await this.artistRepository.getArtist('getsimilar',artist.name, page, limit*page);

            similar.similarartists.artist = similar.similarartists.artist.slice((page-1)*limit);

            if(similar.similarartists.artist){
                similar = await Promise.all( similar.similarartists.artist.map( async (a) => {
                    let artist = await this.getInfo(a.name, true);
                    
                    if(!artist) return;
                    
                    return artist;
                }), this);
                
                similar.forEach( s => artist.similar.addToSet(s._id));
                artist.save();
            }
        }else{
            similar = artist.similar;
        }
        
        return similar;
    }
    
    
    /**
     * Gets top artists
     * 
     * @function getTop
     * @memberof module:services.ArtistService
     * @this module:services.ArtistService
     * @param {String} country - name of the country to fetch results for
     * @param {String} page - page to fetch
     * @param {String} limit - items per page
     * @returns {Array.<module:models.artist>} - An array of popular artists
     * @instance
     * @async
     */
    async getTop(country, page, limit){
        let result;

        if(country){
            const data = await this.artistRepository.getGeo('getTopArtists', country, page, limit);            
            result = data.topartists.artist;
        }else{
            const data = await this.artistRepository.getChart('getTopArtists', page, limit);
            result = data.artists.artist;
        }

        result = await Promise.all( result.map( async (r) => {
            let artist = await this.getInfo(r.name, true);
            return artist;
        }), this);

        if(result.length > limit) result = result.slice((page - 1)*limit);
        
        return result;
    }

    /**
     * Search for ann album
     * 
     * @function search
     * @memberof module:services.AlbumService
     * @this module:services.AlbumService
     * @param {String} query - search string
     * @returns {Object} - An object containing info abut the number of results and an array of album
     * @instance
     * @async
     */
    async search(query, page, limit){
        let search = await this.artistRepository.search('artist', query, page, limit);
        
        if(!search.results) return {}


        return {
            results: {
                query: search.results["@attr"]["for"],
                total: search.results["opensearch:totalResults"],
                page: search.results["opensearch:Query"]["startPage"],
                itemsPerPage: search.results["opensearch:itemsPerPage"]
            },
            matches: await Promise.all(search.results.artistmatches.artist.map( async a => {
                return await this.getInfo(a.name, true);
            }))
        }
    }
}

module.exports = new ArtistService(Artist, LastFmRepository, FanartTvRepository, MusicbrainzRepository, TrackService, AlbumService)