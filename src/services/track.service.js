const BaseService = require("./base.service");
const { LastFmRepository, LyricsRepository, YoutubeRepository } = require('../repositories');
const { ApiError } = require('../errors');
const { Track } = require("../models");

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
            wiki: track.wiki
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
            "name": new RegExp('\\b' + name + '\\b', 'i'),
            "artist": new RegExp('\\b' + artist + '\\b', 'i')
        });

        if(!track){
            let lastFmData = await this.trackRepository.getTrack('getInfo', name, artist);

            if(!lastFmData.track){
                throw new ApiError(9);
            }

            track = await this.formatTrack(lastFmData.track);
            track.save();
        }

        return track;
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
     * @function getSource
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

            track.similar = similar.similartracks.track.map( t => {
                return {
                    name: t.name,
                    artist: t.artist.name
                }
            });

            track.save();
        }

        return track;
    }
}

module.exports = new TrackService(Track, LastFmRepository, YoutubeRepository, LyricsRepository)