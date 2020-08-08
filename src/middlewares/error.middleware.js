/**
* Middleware to catch all errors thrown by the application and return and error response to the user
* @function ErrorMiddleware
* @memberof module:middlewares
* @param {Object} err - Express error object
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
* @return {undefined}
*/

module.exports = (err, req, res, next) => {
    const httpStatus = (err.name == "ValidationError" ? 409 : err.status) || 500;
    return res.status(httpStatus).send({ status: httpStatus, name: err.name, message: err.message || "Internal Server Error"})
}