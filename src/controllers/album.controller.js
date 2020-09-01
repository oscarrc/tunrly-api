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
     * @param {String} req.query.name - Name of the album
     * @param {String} req.query.artist - Artist of the album
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name, artist } = req.query;
        const album = await this.albumService.getInfo(name, artist);

        return res.status(200).send(album);
    }

    /**
     * Gets popular albums by tag
     * 
     * @function getByTag
     * @memberof module:controllers.AlbumController
     * @this module:controllers.AlbumController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.tag - Tag to search
     * @param {String} [req.query.page ]- Page to fetch
     * @param {String} [req.query.limit]- Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getByTag(req,res){
        const { tag, page, name } = req.query;
        const albums = await this.albumService.getByTag(tag, page, name);

        return res.status(200).send(albums);
    }
}

module.exports = new AlbumController(AlbumService);