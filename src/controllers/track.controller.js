const {TrackService} = require('../services');

/**
 * Controller for track related operations. Fullfils coming from module:routes.TrackRoutes using module.services.TrackService
 * 
 * @class TrackController
 * @memberof module:controllers
 */

class TrackController {
    constructor(Service){
        this.trackService = Service;
    }
    
    /**
     * Get info about a track
     * 
     * @function get
     * @memberof module:controllers.TrackController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name, artist } = req.query;
        const track = await this.trackService.getInfo(name, artist);

        return res.status(200).send(track);
    }
}

module.exports = new TrackController(TrackService);