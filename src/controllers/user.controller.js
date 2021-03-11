const { UserService } = require('../services');
const { REGISTRATION_OPEN } = require('../../config');

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
     * Gets user profile.
     * 
     * @function get
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Object} [req.params.username] - Username of the user to get profile
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async get(req,res){
        const { username } = req.params;
        let user = req.user;
        
        if(username){
            user = await this.userService.getPublic(username);
        }

        return res.status(200).send(user);
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
     * Updates
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
        const disallow = ["password", "role", "email"];

        disallow.forEach( opt => delete entity[opt]);
        
        const updatedUser = await this.userService.updateOne(id, entity);
        
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
        const updatedPassword = await this.userService.updatePassword(user, newPassword, oldPassword);

        return res.status(200).send({ success: !!updatedPassword });
    }

    /**
     * Updates current user password
     * 
     * @function setFavorite
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {String} req.body.favId - Id of the item to favorite
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async setFavorite(req,res){
        const { favId, type } = req.body;
        const user = req.user;
        
        const updatedUser = await this.userService.setFavorite(user, type, favId);

        return res.status(200).send(updatedUser);
    }

    /**
     * Adds a played track to the current user history array
     * 
     * @function addToHistory
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {String} req.body.track - Id of the track
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async addToHistory(req,res){
        const { track } = req.body;
        const user = req.user;
        const addedToHistory = await this.userService.addToHistory(user, track);
        
        return res.status(200).send(addedToHistory);
    }

    /**
     * Gets recommended tracks for the user
     * 
     * @function getRecommended
     * @memberof module:controllers.UserController
     * @this module:controllers.UserController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object}
     * @instance
     * @async
     */
    async getRecommended(req,res){
        const user = req.user._id;
        const id = req.params.id;
        const recommended = await this.userService.getRecommended(id, user);

        return res.status(200).send(recommended);
    }
    
}

module.exports = new UserController( UserService );