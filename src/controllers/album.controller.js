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
     * @param {String} req.body.name - Name of the album
     * @param {String} req.body.artist - Artist of the album
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name, artist } = req.query;
        const album = await this.albumService.getInfo(name, artist);

        return res.status(200).send(album);
    }
}

module.exports = new AlbumController(AlbumService);