const express = require('express');

/**
 * Express server for listening for request
 * 
 * @class Server
 * @memberof module:app
 * @param {module:app.router} router - An instance of Router
 * @param {Number} port - A number indicating the port on which the server will listen
 * @param {String} brand - An string with the app name
 * @requires express
 */

class Server {
    constructor(router, port, brand){
        this.port = port;
        this.brand = brand;
        this.router = router;
    }

    /**
     * Starts the server
     * 
     * @function start
     * @memberof module:app.Server
     * @this module:app.Server
     * @returns {Promise} - A promise of the express server listening on the given port
     * @instance
     */
    start(){
        const router = this.router.initialize();
        const app = express().use(router);

        return new Promise( (resolve) => {
            app.listen(this.port, () => {
                console.log(`${this.brand} API is up and listening on port ${this.port}`);
            });

            resolve();
        });
    }
}

module.exports = Server;