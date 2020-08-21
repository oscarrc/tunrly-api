const {ArtistService} = require('../services');

/**
 * Controller for artist related operations. Fullfils coming from module:routes.ArtistRoutes using module.services.ArtistService
 * 
 * @class AuthController
 * @memberof module:controllers
 */

class ArtistController {
    constructor(Service){
        this.artistService = Service;
    }
    
    /**
     * Logs an user in and returns the user, a jwt token and a refresh token
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
}

module.exports = new ArtistController(ArtistService);