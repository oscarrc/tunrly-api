const errors = require('../../config/errors');
/**
* Api predictable errors.
* Extends Error to provide error throw vía code.
*
* @class ApiError
* @extends Error
* @memberof module:errors
* @param {Number} code - Error code
*/
class ApiError extends Error{
    constructor(code){
        super(code);
        this.type = this.constructor.name;
        this.name = errors[this.type][code].name
        this.message = errors[this.type][code].message;
        this.status = errors[this.type][code].status;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;