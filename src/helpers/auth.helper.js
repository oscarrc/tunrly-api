const { sign, verify } = require('jsonwebtoken');
const { JWT_TTL, PRIVATE, PUBLIC } = require('../../config');

/**
 * Auth helper
 * 
 * Helper functions to encode/decode JWT Token
 * @namespace authHelper
 * @memberof module:helpers
 */

/**
 * Generates and signs a JWT Token
 * 
 *
 * @function generateToken
 * @memberof module:helpers.authHelper
 * @param {Object} payload - payload of the JWT token
 * @returns {String} - Signed JWT Token
 */

const generateToken = (payload) => {
    return sign(payload, PRIVATE, { algorithm: 'RS256', expiresIn: JWT_TTL });
}

/**
 * Decodes a JWT Token
 * 
 *
 * @function decodeToken
 * @memberof module:helpers.authHelper
 * @param {String} token - a JWT token
 * @returns {Object} - Decoded JWT token
 */
const decodeToken = (token) => {
    return verify(token, PUBLIC);
}

module.exports = {
    generateToken,
    decodeToken
}