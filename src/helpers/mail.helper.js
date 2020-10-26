const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_CLIENT, GMAIL_SECRET, GMAIL_REFRESH, GMAIL_ACCESS } = require('../../config');

/**
 * Mail helper
 * 
 * Functions to help with mail service
 * @namespace mailHelper
 * @memberof module:helpers
 */

/**
 * Generates and signs a JWT Token
 * 
 * @function compileTemplate
 * @memberof module:helpers.mailHelper
 * @param {String} template - path to a Handlebars template
 * @returns {Object} - Compiled handelbars template
 */
const compileTemplate = async (template) => {    
    return await handlebars.compile(template);
}

/**
 * Creates a transport for nodemailer to send emails
 * 
 * @function createTransport
 * @memberof module:helpers.mailHelper
 * @returns {Object} - The created JWT transport
 */
const createTransport = () => { 
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: GMAIL_USER,
            clientId: GMAIL_CLIENT,
            clientSecret: GMAIL_SECRET,
            refreshToken: GMAIL_REFRESH,
            accessToken: GMAIL_ACCESS
        }
    });
}

module.exports = {
    compileTemplate,
    createTransport
}