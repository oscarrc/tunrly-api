const compression = require('compression');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

/**
 * Main router for initializing the Express router and middlewares
 * 
 * @class Router
 * @memberof module:app
 * @param {Number} version - A number indicating the app version
 * @param {Object} routes - Definitions of the API endpoints
 * @param {Object} middlewares - Definitions of the Express middlewares
 * @property {express.Router} api - Express router for the api
 * @property {express.Router} router - Express router for versioning
 * @requires compression
 * @requires bodyParser
 * @requires helmet
 * @requires cors
 */

class Router{
    constructor(routes, middlewares, version){
        this.api = express.Router();
        this.router = express.Router();
        this.version = version;
        this.routes = routes;
        this.middlewares = middlewares
    }

      /**
     * Configures the middlewares and api endpoints relating them with its respective router
     * 
     * @function initialize
     * @memberof module:app.Router
     * @this module:app.Router
     * @returns {Router} - The configured express router
     * @instance
     */

    initialize(){
        const { AuthRoutes, HomeRoutes, UserRoutes } = this.routes;
        const { AuthMiddleware, ErrorMiddleware, NotfoundMiddleware } = this.middlewares;
        
        //Add middlewares to the API
        this.api.use(bodyParser.json())
                .use(bodyParser.urlencoded({extended:false}))
                .use(cors())
                .use(helmet())
                .use(compression())
                .use(AuthMiddleware.initialize)

        //Declare API routes
        this.api.use("/", HomeRoutes)
                .use("/auth", AuthRoutes)
                .use("/user", UserRoutes);
        
        //Add versioning to the API endpoints
        this.router.use(`/v${this.version}`, this.api)
                    //Add middlewares to handle errors at the end so they will catch all bubbling errors
                //    .use(NotfoundMiddleware)
                //    .use(ErrorMiddleware);

        return this.router;
    }
}

module.exports = Router;