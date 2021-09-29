const Db = require('./db');
const Server = require('./server');
const Router = require('./router');
const OpenApiValidator = require('express-openapi-validator');

const routes = require('../routes');
const middlewares = require('../middlewares');

const { readFile } = require('../helpers/file.helper');

const { BRAND, PORT, MONGO_URL, VERSION } = require('../../config');

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    strictPopulate: false
}

const spec = JSON.parse(readFile(`../../docs/Tunrly.v${VERSION}.json`));

const validator = OpenApiValidator.middleware({
    apiSpec: spec,
    validateSecurity: false
});

const db = new Db(MONGO_URL, mongooseOptions);
const router = new Router(routes, middlewares, validator, VERSION);
const server = new Server(router, PORT, BRAND);

/**
 * App module
 * 
 * Main app. Connects to the datagase, creates the router and starts the server
 * @module app
 */

db.connect().then( () => {
    server.start();
}).catch( (err) => {
    console.log(err);
});