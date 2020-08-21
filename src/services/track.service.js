const BaseService = require("./base.service");
const { LastFmRepository } = require('../repositories');
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
 */

class TrackService extends BaseService{
    constructor(Track, LastFM, FanartTV){
        super(Track);
        this.track = Track;
        this.trackRepository = LastFM;
        this.imageRepository = FanartTV;
    }

    //TODO Get similar tracks, get lyrics and get youtube source

    /**
     * Gets info about a track
     * 
     * @function formatArtist
     * @memberof module:services.TrackService
     * @this module:services.TrackService
     * @param {Object} track - An track as retrieved from Last FM API
     * @returns {module:models.artist} - The track fromatted as Track Model
     * @async
     */
    async formatModel(track){
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
     * @returns {module:models.user} - The found user
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
            track = await this.formatModel(lastFmData.track);
            track.save();
        }

        return track;
    }
}

module.exports = new TrackService(Track, LastFmRepository)