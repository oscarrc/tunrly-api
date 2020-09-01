const BaseService = require("./base.service");
const { LastFmRepository, LyricsRepository, YoutubeRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Track } = require("../models");
const { escapeString } = require('../helpers/regex.helper');

/**
 * Bussiness logic for track management
 * 
 * @class TrackService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.Track} Track - track model
 * @param {module:repositories.LastFmRepository} LastFM - Repo to fetch track in case it doesn't exist in the DB yet.
 * @param {module:repositories.YoutubeRepository} Youtube - Repo to fetch track video.
 * @param {module:repositories.LyricsRepository} Lyrics - Repo to fetch track lyrics.
 */

class TrackService extends BaseService{
    constructor(Track, LastFM, Youtube, Lyrics){
        super(Track);
        this.track = Track;
        this.trackRepository = LastFM;
        this.videoRepository = Youtube;
        this.lyricsRepository = Lyrics;
    }
    
    /**
     * Formats track as track model
     * 
     * @function formatTrack
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {Object} track - An track as retrieved from Last FM API
     * @returns {module:models.artist} - The track fromatted as Track Model
     * @async
     */
    async formatTrack(track){
        track = {
            name: track.name,
            mbid: track.mbid || null,
            duration: track.duration,
            url: track.url,
            image: track.album ? track.album.image.map( (i) => { return i["#text"] }) : [],
            artist: track.artist.name,
            album: track.album ? {
                name: track.album.title,
                artist: track.album.artist
            } : {},
            tags: track.toptags.tag.map( (t) => { return t["name"] }),
            wiki: track.wiki,
            lyrics: await this.lyricsRepository.getLyrics(track.name, track.artist.name),
            source: await this.videoRepository.getVideo(track.name, track.artist.name)
        }

        return new this.track(track);
    }

    /**
     * Gets info about an track
     * 
     * @function getInfo
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} name - The name of the track to get
     * @returns {module:models.track} - The track
     * @throws {ApiError} - ArtistNotFound
     * @instance
     * @async
     */
    async getInfo(name, artist){
        let track = await this.track.findOne({
            "name": new RegExp('\\b' + escapeString(name) + '\\b', 'i'),
            "artist": new RegExp('\\b' + escapeString(artist) + '\\b', 'i')
        });
        
        if(!track){
            let lastFmData = await this.trackRepository.getTrack('getInfo', name, artist);
            
            if(!lastFmData.track){
                // throw new ApiError(9);
                return;
            }
            
            track = await this.formatTrack(lastFmData.track);
        }

        return track.save();
    }

    /**
     * Gets popular tracks by tag
     * 
     * @function getByTag
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} tag - Tag to get top tracks for
     * @param {Number} page - The page to fetch
     * @param {Number} limit - Results per page
     * @returns {Array.<module:models.track>} - Track array
     * @instance
     * @async
     */
    async getByTag(tag, page, limit){
        const data = await this.trackRepository.getTag('gettoptracks', tag, page, limit);            
        let tracks = data.tracks.track;

        tracks = await Promise.all( tracks.map( async (t) => {
            return await this.getInfo(t.name, t.artist.name);
        }))

        return tracks;
    }

    /**
     * Gets track lyrics
     * 
     * @function getLyrics
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} id - Id of the track to get lyrics for
     * @returns {module:models.track} - The track with added Lyrics
     * @throws {ApiError} - TrackNotFound
     * @instance
     * @async
     */
    async getLyrics(id){
        let track = await this.track.findById(id);
        
        if(!track){
            throw new ApiError(9);
        }

        if(!track.lyrics){
            const lyrics = await this.lyricsRepository.getLyrics(track.name, track.artist);

            if(lyrics){
                track.lyrics = lyrics;
                track.save();
            }
        }

        return track;
    }

    /**
     * Gets track video source
     * 
     * @function getSource
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} id - Id of the track to get source for
     * @returns {module:models.track} - The track with added source
     * @throws {ApiError} - TrackNotFound
     * @instance
     * @async
     */
    async getSource(id){
        let track = await this.track.findById(id);
        
        if(!track){
            throw new ApiError(9);
        }

        if(!track.source){
            const source = await this.videoRepository.getVideo(track.name, track.artist);

            if(source){
                track.source = source;
                track.save();
            }
        }

        return track;
    }

     /**
     * Gets track similar to the given one
     * 
     * @function getSimilar
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} id - Id of the track to get similar tracks for
     * @returns {module:models.track} - The track with added similar tracks
     * @throws {ApiError} - TrackNotFound
     * @instance
     * @async
     */
    async getSimilar(id){
        let track = await this.track.findById(id);
        
        if(!track){
            throw new ApiError(9);
        }

        if(!track.similar || track.similar.length === 0){
            const similar = await this.trackRepository.getTrack("getsimilar", track.name, track.artist);
            
            track.similar = await Promise.all(similar.similartracks.track.map( async (t) => {
                let track = await this.getInfo(t.name, t.artist.name);                
                if(!track) return;

                return track._id;
            }), this)

            await track.populate({path: 'similar', select: 'name artist album source'})
        }

        return track.save();
    }

    /**
     * Gets top tracks
     * 
     * @function getTop
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} country - name of the country to fetch results for
     * @param {String} page - page to fetch
     * @param {String} limit - items per page
     * @returns {Array.<module:models.track>} - An array of popular tracks
     * @instance
     * @async
     */
    async getTop(country, page, limit){
        let result;

        if(country){
            const data = await this.trackRepository.getGeo('getTopTracks', country, page, limit);            
            result = data.toptracks.track;
        }else{
            const data = await this.trackRepository.getChart('getTopTracks', page, limit);
            result = data.tracks.track;
        }

        result = Promise.all( result.map( async (r) => {
            return await this.getInfo(r.name, r.artist.name);
        }), this);

        return result;
    }

    /**
     * Search for a track
     * 
     * @function search
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {String} query - search string
     * @returns {Object} - An object containing info abut the number of results and an array of tracks
     * @instance
     * @async
     */
    async search(query, page, limit){
        let search = await this.trackRepository.search('track', query, page, limit);

        if(!search.results) return {}

        return {
            results: {
                query: search.results["@attr"]["for"],
                total: search.results["opensearch:totalResults"],
                page: search.results["opensearch:Query"]["startPage"],
                itemsPerPage: search.results["opensearch:itemsPerPage"]
            },
            matches: Promise.all(search.results.trackmatches.track.map( async t => {
                return this.getInfo(t.name, t.artist.name);
            }))
        }
    }
}

module.exports = new TrackService(Track, LastFmRepository, YoutubeRepository, LyricsRepository)