const Db = require('./db');
const Server = require('./server');
const Router = require('./router');

const routes = require('../routes');

const { BRAND, PORT, MONGO_URL, VERSION } = require('../../config');

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

const db = new Db(MONGO_URL, mongooseOptions);
const router = new Router(routes, VERSION);
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