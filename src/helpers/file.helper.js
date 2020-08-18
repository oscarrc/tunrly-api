const fs = require('fs');
const path = require('path');
/**
 * File helper
 * 
 * Functions to locate and read files from the file system
 * @namespace fileHelper
 * @memberof module:helpers
 */

/**
 * Gets absolute path from relative path
 * 
 * @function getPath
 * @memberof module:helpers.fileHelper
 * @param {String} relativePath - relative path to convert
 * @returns {String} - Absolute path
 */
const getPath = (relativePath) => {
    return path.resolve(__dirname, relativePath);
}

/**
 * Reads a file from relative path
 * 
 * @function readFile
 * @memberof module:helpers.fileHelper
 * @param {String} relativeFile - relative path to the file
 * @returns {String | Buffer } - The file read
 */
const readFile = (relativeFile) => {
    return fs.readFileSync(path.resolve(__dirname, relativeFile), 'utf8');
}

module.exports = {
    getPath,
    readFile
}