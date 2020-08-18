
const { compileTemplate, createTransport } = require('../helpers/mail.helper');
const { readFile, getPath } = require('../helpers/file.helper');

/**
 * Composes and sends emails
 * 
 * @class MailService
 * @memberof module:services
 * @param {String} to - Email recipient
 * @param {String} subject - Subject of the email
 * @param {String} template - Relative path of the template
 * @param {Object} data - Key:value pairs matching template's fields
 */
class MailService{
    constructor( to, subject, template, data ){
        
        this.to = to;
        this.subject = subject;
        this.data = data;
        this.template = template
    }

    /**
     * Performs the email send operation
     * 
     * @function send
     * @memberof module:services.MailService
     * @this module:services.MailService
     * @returns {Object} - Info about email sent
     * @instance
     * @async
     */
    async send(){
        const transport = await createTransport();
        const template = await compileTemplate(readFile(`../../templates/${this.template}.hbs`));

        const mail = {
            to: this.to,
            subject: this.subject,
            attachments: [
                {
                    filename: 'facebook.png',
                    path: getPath('../../assets/images') +'/facebook.png',
                    cid: 'facebook'
                },
                {
                    filename: 'twitter.png',
                    path: getPath('../../assets/images') +'/twitter.png',
                    cid: 'twitter'
                },
                {
                    filename: 'instagram.png',
                    path: getPath('../../assets/images') +'/instagram.png',
                    cid: 'instagram'
                },
                {
                    filename: 'mail.png',
                    path: getPath('../../assets/images') +'/mail.png',
                    cid: 'mail'
                },
                {
                    filename: 'header.png',
                    path: getPath('../../assets/images') +'/header.png',
                    cid: 'header'
                },
                {
                    filename: 'logo.png',
                    path: getPath('../../assets/images') +'/logo.png',
                    cid: 'logo'
                },
            ],
            html: template(this.data)
        }
        
        return await transport.sendMail(mail, () => {
            transport.close();
        });
    }
}

module.exports = MailService;