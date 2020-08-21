const BaseService = require("./base.service");
const { ApiError } = require('../errors');
const { User } = require("../models");

/**
 * Bussiness logic for user management
 * 
 * @class UserService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.User} User - User model
 */

class UserService extends BaseService{
     constructor(User){
        super(User);
        this.user = User;
     }

     /**
     * Authenticates an user via a valid JWT token
     * 
     * @function findByUsernameOrEmail
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} value - Username or email to query for
     * @returns {module:models.user} - The found user
     * @throws {ApiError} - UserNotFound
     * @instance
     * @async
     */
     async findByUsernameOrEmail(value){
        const found = await this.user.findOne( { $or: [ { username: value }, { email: value }  ] } )
        
        if( !found ){
            throw new ApiError(4);
        }

        return found;
     }

     /**
     * Authenticates an user via a valid JWT token
     * 
     * @function updatePassword
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} user - User to update 
     * @param {String} newPassword - The new user's password
     * @param {String} oldPassword - The current user's password
     * @returns {module:models.user} - The updated user
     * @throws {ApiError} - BadPassword
     * @instance
     * @async
     */
     async updatePassword(user, newPassword, oldPassword){
        if( user && oldPassword ){
            const validPassword = user.comparePassword(oldPassword);

            if( !validPassword ){
                throw new ApiError(5);
            }
        }

        user.password = newPassword;
        user.save();
        
        return user;
     }
 }

 module.exports = new UserService(User);