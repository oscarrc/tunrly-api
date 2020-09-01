const winston = require('winston');
const expressWinston = require('express-winston');
const { LOG_LEVEL } = require('../../config');

/**
* Middleware to log api access and errors
* @function LoggerMiddleware
* @memberof module:middlewares
* @requires winston
* @requires expressWinston
* @return {function}
*/

module.exports = expressWinston.logger({
    transports: [
        new winston.transports.Console({ level: LOG_LEVEL, humanReadableUnhandledException: true, colorize: true }),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    statusLevels: true,
    dynamicMeta: (req, res) => {
        if(req.body.password){
            delete req.body.password;
        }

        return {
            req: {
                url: req.url,
                headers: req.headers,
                body: req.body ? req.body : {},
                
            },
            res:{
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
            },
            user:{
                _id: req.user ? req.user._id : "Unauthenticated",
                Ip: req.connection.remoteAddress
            }
        }
    },
    skip: () => { return process.env.NODE_ENV === 'test' ? true : false }
});