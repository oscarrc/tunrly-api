const { UserService } = require('../services');

class UserController{
    constructor( Service ){
        this.userService = Service;
    }

    async check(req,res){
        const {value} = req.query;
        const exists = await this.userService.findByUsernameOrEmail(value);
        
        return res.status(200).send({ available: !exists });
    }

    /**
     * Gets current user profile.
     * 
     * @function get
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        return res.status(200).send(req.user);
    }

    /**
     * Creates a new user
     * 
     * @function create
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {Object} req.body.user - User to create
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async create(req,res){
        const user = req.body;
        const newUser = await this.userService.create(user);
        
        return res.status(201).send({ success: !!newUser });
    }
    
    /**
     * Creates a new user
     * 
     * @function create
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {Object} req.body.entity - User fields to update
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async update(req,res){
        const entity = req.body;
        const id = req.user._id;
        const updatedUser = await this.userService.update(id, entity);
        
        return res.status(200).send(updatedUser);
    }

    /**
     * Updates current user password
     * 
     * @function updatePassword
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {String} [req.body.oldPassword] - Old user password
     * @param {String} req.body.newPassword - New user password
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async updatePassword(req,res){
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        const updatedPassword = await this.userService.updatePassword(user, oldPassword, newPassword);

        return res.status(200).send({ success: !!updatedPassword });
    }

    async setFavorite(req,res){
        const { favId, type } = req.body;
        const user = req.user;
        
        const updatedUser = await this.userService.setFavorite(user, type, favId);

        return res.status(200).send(updatedUser);
    }
}

module.exports = new UserController( UserService );