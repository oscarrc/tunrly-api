const BaseService = require("./base.service");
const { ApiError } = require('../errors');
const { Playlist } = require("../models");

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
     * @memberof module:services.UserService
     * @this module:services.UserService
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
     * @memberof module:services.UserService
     * @this module:services.UserService
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
     * @memberof module:services.UserService
     * @this module:services.UserService
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

        return added;
    }

    /**
     * Deletes a playlist belonging to an user
     * 
     * @function deletePlaylist
     * @memberof module:services.UserService
     * @this module:services.UserService
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

    async getUserPlaylists(user){
        const playlists = await this.playlist.find({user: user});

        return playlists;
    }
}

module.exports = new PlaylistService(Playlist);