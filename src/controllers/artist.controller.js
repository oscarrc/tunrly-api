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
     * @param {String} req.params.name - Name of the artist
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { name } = req.params;
        const artist = await this.artistService.getInfo(name);

        return res.status(200).send(artist);
    }

    /**
     * Get info about many artists
     * 
     * @function getMany
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.ids - A list of ids
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getMany(req,res){
        const { ids } = req.query;
        const artists = await this.artistService.getMany(ids.split(','));
        return res.status(200).send(artists);
    }

     /**
     * Get similar artists to the given one
     * 
     * @function getSimilar
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.params.id - Id of the artist
     * @param {String} req.query.page - Page to fetch
     * @param {String} req.query.limit - Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getSimilar(req,res){
        const { id } = req.params;
        const { page, limit } = req.query;
        const artist = await this.artistService.getSimilar(id, page, limit);

        return res.status(200).send(artist);
    }

    /**
     * Get top albums for the artist
     * 
     * @function getAlbums
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.params.id - Id of the artist
     * @param {String} req.query.page - Page to fetch
     * @param {String} req.query.limit - Items per page
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getAlbums(req, res){
        const { id } = req.params;
        const { page, limit } = req.query;
        const artist = await this.artistService.getAlbums(id, page, limit);

        return res.status(200).send(artist);
    }

    /**
     * Get top tracks for the artist
     * 
     * @function getTracks
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.params.id - Id of the artist
     * @param {String} req.query.page - Page to fetch
     * @param {String} req.query.limit - Items per page
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getTracks(req, res){
        const { id } = req.params;
        const { page, limit } = req.query;
        const artist = await this.artistService.getTracks(id, page, limit);

        return res.status(200).send(artist);
    }

     /**
     * Gets top artists
     * 
     * @function getTop
     * @memberof module:controllers.ArtistController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.country - Name of the country to fetch popular artists
     * @param {String} req.query.page - Page to fetch
     * @param {String} req.query.limit - Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getTop(req,res){
        const { country, page, limit } = req.query;
        const topArtists = await this.artistService.getTop(country, page, limit );

        return res.status(200).send(topArtists);
    }
}

module.exports = new ArtistController(ArtistService);