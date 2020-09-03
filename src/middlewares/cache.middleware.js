const mongoose = require("mongoose");
const cacheManager = require("cache-manager");
const mongooseStore = require("cache-manager-mongoose");

//TODO update expiration of popular requests
const cache = cacheManager.caching({
    store: mongooseStore,
    mongoose: mongoose,
    modelOptions: {
        collection: "cache"
    },
    ttl: 604800 // 1 Semana
});

/**
* Middleware to cache 3rd party api calls to the database
* @function CacheMiddleware
* @memberof module:middlewares
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
* @requires mongoose
* @requires cache-manager
* @requires cache-manager-mongoose
* @return {function}
*/

module.exports = async (req,res,next) => {
    const url = req.protocol + '://' + req.headers.host + req.originalUrl;

    if (req.method != "GET") {
        cache.del(url);
    }
    
    cache.get(url, {}, function(err, result) {
        if(result){
            return res.status(200).send(JSON.parse(result))
        }

        res.sendResponse = res.send
        
        res.send = (body) => {
            if(res.statusCode < 400){
                cache.set(url, body);
            }

            return res.status(res.statusCode).sendResponse(body)
        }

        return next()
    });
}