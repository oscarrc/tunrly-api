const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_HOST, EMAIL_PORT, EMAIL_PASS } = require('../../config');

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
        // service: "gmail",
        // auth: {
        //     type: "OAuth2",
        //     user: GMAIL_USER,
        //     clientId: GMAIL_CLIENT,
        //     clientSecret: GMAIL_SECRET,
        //     refreshToken: GMAIL_REFRESH,
        //     accessToken: GMAIL_ACCESS
        // }        
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}

module.exports = {
    compileTemplate,
    createTransport
}