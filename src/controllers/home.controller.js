const { HomeService } = require('../services');

/**
 * Controller for requests to the base URL coming from module:routes.HomeRoutes and fulfilled by modules:services:HomeService
 * 
 * @class HomeController
 * @memberof module:controllers
 * @param {module:repositories.HomeService} HomeService  - An instance of HomeService
 */

class HomeController{
    constructor(HomeService){
        this.homeService = HomeService;
    }

    /**
     * Returns a message for the base url request
     * 
     * @function index
     * @memberof module:controllers.HomeController
     * @this module:controllers.HomeController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    index(req,res){
        return res.send(this.homeService.index());
    }
}

module.exports = new HomeController(HomeService);