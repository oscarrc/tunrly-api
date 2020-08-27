const asyncErrors = require('express-async-errors');
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
    constructor(routes, middlewares, validator, version){
        this.api = express.Router();
        this.router = express.Router();
        this.version = version;
        this.validator = validator;
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
        const { AlbumRoutes, ArtistRoutes, AuthRoutes, HomeRoutes, TrackRoutes, UserRoutes, ValidationRoutes } = this.routes;
        const { AuthMiddleware, ErrorMiddleware, LoggerMiddleware, NotfoundMiddleware } = this.middlewares;
        
        //Add middlewares to the API
        this.api.use(bodyParser.json())
                .use(bodyParser.urlencoded({extended:false}))
                .use(cors())
                .use(helmet())
                .use(compression())
                .use(LoggerMiddleware)
                .use(AuthMiddleware.initialize)

        //Add validator to validate requests against the schema, just before our routes
        // this.validator.installSync(this.api);

        //Declare API routes
        this.api.use("/", HomeRoutes)
                .use("/album", AlbumRoutes)
                .use("/artist", ArtistRoutes)
                .use("/auth", AuthRoutes)
                .use("/track", TrackRoutes)
                .use("/user", UserRoutes)
                .use("/validation", ValidationRoutes);
        
        //Add versioning to the API endpoints
        this.router.use(`/v${this.version}`, this.api)
                   .use(NotfoundMiddleware)
                   .use(ErrorMiddleware);

        return this.router;
    }
}

module.exports = Router;