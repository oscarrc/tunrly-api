/**
* Middleware to catch all non existing endpoints and return a 404 error
* @function NotfoundMiddleware
* @memberof module:middlewares
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Function} next - Express next middleware function
* @returns {Object} res - Express response object
*/

module.exports = (req, res, next) => {
    res.status(404).send({ status: 404, message: "Resource not found"});
}