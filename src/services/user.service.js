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
     * Updates user password
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

     /**
     * Add / removes favorite from user.favorites collection
     * 
     * @function setFavorite
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} user - User to set/unset favorite for 
     * @param {String} type - album, artist, track or playlist
     * @param {String} favId - Id of the favorited item
     * @returns {module:models.user} - The updated user
     * @instance
     * @async
     */
     async setFavorite(user, type, favId){
         const favorited = user.favorite[type].find( f => {
             return f._id = favId;
         });

         let query;

         if(favorited){
            query = { "$pull":{}};    
            query["$pull"]["favorite." + type] = favId;
         }else{
            query = {"$addToSet":{}};    
            query["$addToSet"]["favorite." + type] = favId;
         }

         const updated = await this.user.findOneAndUpdate( { '_id': user._id }, query, { new: true } );

         if(!updated){
            throw new ApiError(4);
         }

         return updated;
     }

      /**
     * Adds a track to the user's played history
     * 
     * @function addToHistory
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} user - User to add to history
     * @param {String} track - Id of the track to add
     * @returns {module:models.user} - The updated user
     * @instance
     * @async
     */
     async addToHistory(user, track){
        const addedToHistory = await this.user.findOneAndUpdate( { '_id': user._id }, { '$addToSet': { 'history': track, '$slice': 100 }}, { new: true } );
        
        if(!addedToHistory){
            throw new ApiError(4);
        }

        return addedToHistory;
     }
 }

 module.exports = new UserService(User);