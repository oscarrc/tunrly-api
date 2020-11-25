const {AlbumService} = require('../services');

/**
 * Controller for album related operations. Fullfils coming from module:routes.AlbumRoutes using module.services.AlbumService
 * 
 * @class AlbumController
 * @memberof module:controllers
 */

class AlbumController {
    constructor(Service){
        this.albumService = Service;
    }
    
    /**
     * Gets info about an album
     * 
     * @function get
     * @memberof module:controllers.AlbumController
     * @this module:controllers.AlbumController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.params.name - Name of the album
     * @param {String} req.params.artist - Artist of the album
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name, artist } = req.params;
        const album = await this.albumService.getInfo(name, artist);

        return res.status(200).send(album);
    }

    /**
     * Gets info about many album
     * 
     * @function getMany
     * @memberof module:controllers.AlbumController
     * @this module:controllers.AlbumController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.ids - A list of ids to retrieve
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getMany(req,res){
        const { ids } = req.query;
        const albums = ids ? await this.albumService.getMany(ids.split(',')) : [];
        
        return res.status(200).send(albums);
    }
}

module.exports = new AlbumController(AlbumService);