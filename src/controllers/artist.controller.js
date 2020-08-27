const {ArtistService} = require('../services');

/**
 * Controller for artist related operations. Fullfils coming from module:routes.ArtistRoutes using module.services.ArtistService
 * 
 * @class ArtistController
 * @memberof module:controllers
 */

class ArtistController {
    constructor(Service){
        this.artistService = Service;
    }
    
    /**
     * Get info about an artist
     * 
     * @function get
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name } = req.query;
        const artist = await this.artistService.getInfo(name);

        return res.status(200).send(artist);
    }

    async getSimilar(req,res){
        const { id } = req.query;
        const artist = await this.artistService.getSimilar(id);

        return res.status(200).send(artist);
    }

    async getAlbums(req, res){
        const { id } = req.query;
        const artist = await this.artistService.getAlbums(id);

        return res.status(200).send(artist);
    }

    async getTracks(req, res){
        const { id } = req.query;
        const artist = await this.artistService.getTracks(id);

        return res.status(200).send(artist);
    }
}

module.exports = new ArtistController(ArtistService);