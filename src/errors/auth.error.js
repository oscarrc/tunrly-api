const ApiError = require('./api.error');

/**
* Authentication / Authorization errors
*
* @class AuthError
* @extends ApiError
* @memberof module:errors
* @param {Number} code - Error code as defined in /config/errors.js
*/
class AuthError extends ApiError{
    constructor(code){
        super(code)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AuthError;