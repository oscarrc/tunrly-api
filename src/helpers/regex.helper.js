/**
 * Regex helper
 * 
 * Functions to help with regex
 * @namespace regexHelper
 * @memberof module:helpers
 */

/**
 * Escape illegal characters on regex strings
 * 
 * @function escapeString
 * @memberof module:helpers.regexHelper
 * @param {String} string - String to escape
 * @returns {String} - Escaped string
 */
const escapeString = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = {
    escapeString
}