const BaseService = require("./base.service");
const { ApiError } = require('../errors');
const { Playlist } = require("../models");
const { escapeString } = require('../helpers/regex.helper');

/**
 * Bussiness logic for Playlist management
 * 
 * @class PlaylistService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.Playlist} Playlist - playlist model
 */

class PlaylistService extends BaseService{
    constructor(Playlist){
        super(Playlist);
        this.playlist = Playlist;
    }    

    /**
     * Adds the given track to the given playlist
     * 
     * @function addToPlaylist
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} id - Id of the target playlist
     * @param {String} user - User to set/unset favorite for 
     * @param {String} track - Id of the track to add
     * @returns {module:models.playlist} - The updated playlist
     * @instance
     * @async
     */
    async addToPlaylist(id, user, track){
        const added = await this.playlist.findOneAndUpdate( { '_id': id, 'user': user._id }, { '$addToSet': { 'tracks': track }}, { new: true } );;

        if(!added){
            throw new ApiError(10);
        }

        return added;
    }

    /**
     * Removes the given track to the given playlist
     * 
     * @function removeFromPlaylist
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} id - Id of the target playlist
     * @param {String} user - User to set/unset favorite for 
     * @param {String} track - Id of the track to add
     * @returns {module:models.playlist} - The updated playlist
     * @instance
     * @async
     */
    async removeFromPlaylist(id, user, track){
        const removed = await this.playlist.findOneAndUpdate( { '_id': id, 'user': user._id }, { '$pull': { 'tracks': track }}, { new: true } );

        if(!removed){
            throw new ApiError(11);
        }

        return removed;
    }

    /**
     * Updates a playlist belonging to an user
     * 
     * @function updatePlaylist
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} id - Id of the target playlist
     * @param {String} user - User to set/unset favorite for 
     * @param {String} playlist - Updated playlist data
     * @returns {module:models.playlist} - The updated playlist
     * @instance
     * @async
     */
    async updatePlaylist(id, user, playlist){
        const updated = await this.playlist.findOneAndUpdate( { '_id': id, 'user': user._id }, playlist, { new: true } );
        
        if(!updated){
            throw new ApiError(12);
        }

        return updated;
    }

    /**
     * Deletes a playlist belonging to an user
     * 
     * @function deletePlaylist
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} id - Id of the target playlist
     * @param {String} user - User owning the playlist
     * @returns {Boolean} deleted - The operation status
     * @instance
     * @async
     */
    async deletePlaylist(id, user){
        const deleted = await this.playlist.deleteOne( { '_id': id, 'user': user._id });

        if(!deleted){
            throw new ApiError(12);
        }

        return !!deleted;
    }

    //TODO move this to user and get Public profile
    /**
     * Gets public playlists or for a specific user
     * 
     * @function getPublic
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} user - Id of the user to get the playlists
     * @returns {Array.<module:models.playlist>} An array of public playlists for the user
     * @instance
     * @async
     */
    async getPublic(user, page=1, limit=10){
        let playlists;

        limit = parseInt(limit);
        page = parseInt(page);

        if(user){
            playlists = await this.playlist.find({user: user, public: true});
        }else{
            playlists = await this.playlist.find({ public: true }, '', { skip: (page-1)*limit, limit: limit });
        }
        
        if(!playlists){
            throw new ApiError(12);
        }

        return playlists;
    }

    /**
     * Gets popular playlists by tag
     * 
     * @function getByTag
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} tag - Tag to get top playlists for
     * @param {Number} page - The page to fetch
     * @param {Number} limit - Results per page
     * @returns {Array.<module:models.playlist>} - Playlist array
     * @instance
     * @async
     */
    async getByTag(tag, page, limit){
        page = parseInt(page);
        limit = parseInt(limit);
        const playlists = await this.playlist.find({ public: true, tags: tag }, '', { skip: (page-1)*limit, limit: limit });

        return playlists;
    }

    /**
     * Deletes a playlist belonging to an user
     * 
     * @function search
     * @memberof module:services.PlaylistService
     * @this module:services.PlaylistService
     * @param {String} user - Id of the user to get the playlists
     * @returns {Array.<module:models.playlist>} An array of public playlists found for the query
     * @instance
     * @async
     */
    async search(query, page = 1, limit = 10){
        limit = parseInt(limit);
        page = parseInt(page);
        const q = {
            $or:[
                {"name": new RegExp('\\b' + escapeString(query) + '\\b', 'i')},
                {"description": new RegExp('\\b' + escapeString(query) + '\\b', 'i')}
            ]
        };
        const playlists = await this.playlist.find(q, '', { skip: (page-1)*limit, limit: limit }); 
        const count = await this.playlist.countDocuments(q);

        if(!count) return {}

        return {
            results: {
                total: count,
                page: page,
                itemsPerPage: limit
            },
            matches: playlists
        };
    }
}

module.exports = new PlaylistService(Playlist);