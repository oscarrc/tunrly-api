const {PlaylistService} = require('../services');

/**
 * Controller for playlist related operations. Fullfils coming from module:routes.PlaylistRoutes using module.services.PlaylistService
 * 
 * @class PlaylistController
 * @memberof module:controllers
 */

class PlaylistController {
    constructor(Service){
        this.playlistService = Service;
    }
    
    /**
     * Gets info about a playlist
     * 
     * @function get
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.params.id - id of the playlist
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { id } = req.params;
        const playlist = await this.playlistService.get(id);

        return res.status(200).send(playlist);
    }

    /**
     * Creates a new playlist for the user
     * 
     * @function create
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.body - Formatted as playlist
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async create(req,res){
        const playlist = req.body;        
        playlist.user = req.user._id;

        const newPlaylist = await this.playlistService.create(playlist);

        return res.status(201).send(newPlaylist);
    }

    /**
     * Updates an user playlist
     * 
     * @function update
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.body - Formatted as playlist
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async update(req,res){
        const { id } = req.params;
        const playlist = req.body;
        const user = req.user;
        
        const updatedPlaylist = await this.playlistService.updatePlaylist(id, user, playlist);

        return res.status(200).send(updatedPlaylist);
    }

    /**
     * Updates an user playlist
     * 
     * @function delete
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.params.id - The id of the playlist to remove
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async delete(req,res){
        const { id } = req.params;
        const user = req.user;

        const deleted = await this.playlistService.deletePlaylist(id, user);

        return res.status(200).send({success: deleted});
    }

    /**
     * Adds a track to the given playlist
     * 
     * @function addToPlaylist
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.body.id - Id of the playlist
     * @param {String} req.body.track - Id of the track to add
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async addToPlaylist(req,res){
        const { id, track } = req.body;
        const user = req.user;

        const added = await this.playlistService.addToPlaylist(id, user, track);

        return res.status(200).send(added);
    }

    /**
     * Removes a track from the given playlist
     * 
     * @function removeFromPlaylist
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.body.id - Id of the playlist
     * @param {String} req.body.track - Id of the track to add
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async removeFromPlaylist(req,res){
        const { id, track } = req.body;
        const user = req.user;

        const removed = await this.playlistService.removeFromPlaylist(id, user, track);

        return res.status(200).send(removed);
    }

    /**
     * Gets user public playlists
     * 
     * @function getUserPlaylists
     * @memberof module:controllers.PlaylistController
     * @this module:controllers.PlaylistController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.user - Id of the user to get playlists for
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getPublic(req,res){
        const { ids, user, page, limit } = req.query;
        let playlists;

        if(ids){             
            playlists = await this.playlistService.getMany(ids.split(','));
        }else{            
            playlists = await this.playlistService.getPublic(user, page, limit);
        }

        return res.status(200).send(playlists);
    }
}

module.exports = new PlaylistController(PlaylistService);