const {TrackService} = require('../services');
const lyrics = require('azlyrics-scraper/src/lyrics');

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
     * @param {String} req.params.name - Name of the track
     * @param {String} req.params.artist - Artist of the track
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name, artist } = req.params;
        const track = await this.trackService.getInfo(name, artist);

        return res.status(200).send(track);
    }

    /**
     * Get info about many tracks
     * 
     * @function getMany
     * @memberof module:controllers.TrackController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.ids - List of ids
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getMany(req,res){
        const { ids } = req.query;
        const tracks = await this.trackService.getMany(ids.split(','));

        return res.status(200).send(tracks);
    }

    /**
     * Get lyrics for a track
     * 
     * @function getLyrics
     * @memberof module:controllers.TrackController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.params.id - Id of the track
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getLyrics(req,res){
        const { id } = req.params;
        const lyrics = await this.trackService.getLyrics(id);
        
        return res.status(200).send({lyrics: lyrics});
    }

    /**
     * Get video source for a track
     * 
     * @function getSource
     * @memberof module:controllers.TrackController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.params.id - Id of the track
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getSource(req,res){
        const { id } = req.params;
        const source = await this.trackService.getSource(id);

        return res.status(200).send({source: source});
    }

    /**
     * Get similar tracks for the given one
     * 
     * @function getSimilar
     * @memberof module:controllers.TrackController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.params.id - Id of the track
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getSimilar(req,res){
        const { id } = req.params;
        
        const track = await this.trackService.getSimilar(id);

        return res.status(200).send(track);
    }

    /**
     * Gets top artists
     * 
     * @function getTop
     * @memberof module:controllers.TrackController
     * @this module:controllers.TrackController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.country - Name of the country to fetch popular tracks
     * @param {String} req.query.page - Page to fetch
     * @param {String} req.query.limit - Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getTop(req,res){
        const { country, page, limit } = req.query;
        const topTracks = await this.trackService.getTop(country, page, limit );

        return res.status(200).send(topTracks);
    }
}

module.exports = new TrackController(TrackService);