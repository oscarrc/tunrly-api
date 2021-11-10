const { UserService, ValidationService, MailService } = require('../services');
const { WEB_URL } = require('../../config');

/**
 * Controller for validation related operations. Fullfils coming from module:routes.ValidationRoutes using module.services.ValidationService
 * 
 * @class ValidationController
 * @memberof module:controllers
 * @param {module:repositories.ValidationService} ValidationService  - An instance of ValidationService
 * @param {module:repositories.UserService} UserService  - An instance of UserService
 * @param {module:repositories.MailService} MailService  - An instance of MailService
 */

class ValidationController {
    constructor(UserService, ValidationService, MailService){
        this.userService = UserService;
        this.validationService = ValidationService;
        this.mailService = MailService;
    }

    /**
     * Creates a new validation object and sends an email to the provided address
     * 
     * @function create
     * @memberof module:controllers.ValidationController
     * @this module:controllers.ValidationController
     * @param {Object} req - Express request object
     * @param {String} req.body.email - Email of the user
     * @param {('0'|'1')} req.body.action - Action to perform
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async create(req,res){
        const { user, action } = req.body;
        const curentUser = await this.userService.findByUsernameOrEmail(user);
        const validation = await this.validationService.create({user:curentUser._id, action:action});
        const mail = new this.mailService(curentUser.email, action == 0 ? "Verify your email address" : "Reset your password", 'callToAction', {
            title: "Hello there",
            text: "Please click on the button bellow " + (action==0 ? "to activate your account" : "reset your password") + " and start listening music",
            button: action == 0 ? "Verify your email address" : "Reset your password",
            link: `${WEB_URL}/validation/${action}/${validation.token}`,
            subtext: "If this button doesn't work, please, copy and paste the following url on your browser:",
            bottomline: "If you didn't attempt to " + (action==0 ? "verify your email address" : "reset your password") + " within our service, please, delete this email.",
            farewell: "Cheers",
        });

        mail.send();
        
        res.status(200).send({ success: !!validation });
    }

    /**
     * Performs a validation action of a previusly created validation
     * 
     * @function validate
     * @memberof module:controllers.ValidationController
     * @this module:controllers.ValidationController
     * @param {Object} req - Express request object
     * @param {String} req.body.token - Validation token
     * @param {('0'|'1')} req.body.action - Action to perform
     * @param {String} [req.body.password] - If action is '1', the new password for the user
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async validate(req,res){
        const { token, action, password } = req.body;
        const validation = await this.validationService.validate(token, action);
        let validated = null;

        if(action == 0){
            validated = await this.userService.update(validation.user._id, { status: 1 } );
        }else if( action==1 ){
            validated = await this.userService.updatePassword(validation.user, password);
        }

        const mail = new this.mailService(validated.email, action == 0 ? "Email verified" : "Password changed", 'callToAction', {
            title: "Hello there",
            text: "Your " + (action == 0 ? "email has been verified" : "password has been changed") + ". Click the button below to sign in and start listening music.",
            button: "Sign in",
            link: `${WEB_URL}`,
            subtext: "If this button doesn't work, please, copy and paste the following url on your browser:",
            bottomline: "If you didn't attempt to " + (action==0 ? "verify your email address" : "reset your password") + " whithin our service, please, delete this email.",
            farewell: "Cheers"
        });

        await mail.send();
             
        res.status(200).send({ success: !!validated });
    }
}

module.exports = new ValidationController(UserService, ValidationService, MailService);