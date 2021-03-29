const BaseService = require("./base.service");
const { ApiError } = require('../errors');
const { User } = require("../models");
const { AuthError } = require("../../config/errors");

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
        
        return found;
     }

     /**
     * Gets public profile for an user
     * 
     * @function getPublic
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} value - Username or email to query for
     * @returns {module:models.user} - The found user
     * @throws {ApiError} - UserNotFound
     * @instance
     * @async
     */
    async getPublic(value){
      let found = await this.user.findOne( { 
         $or: [ { username: value }, { email: value }  ],
         "settings.publicProfile": true 
      })

      if(!found){
         throw new ApiError(4)
      }

      found = {
         _id: found._id,
         username: found.username,
         image: found.image,
         playlists: found.playlists.filter(playlist => playlist.public),
         favorite: found.settings.publicFavorites ? found.favorite : {},
         createdAt: found.createdAt
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
             return f._id == favId;
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
        const index = user.history.findIndex( t => t === track);
        
        if(index >= 0 ) user.history.slice(index, 1);
        if(user.history.length >= 120) user.history.$shift();
        user.history.push(track);
        
        const addedToHistory = await this.user.findOneAndUpdate( { '_id': user._id }, { 'history': user.history }, { new: true } );

        if(!addedToHistory) throw new ApiError(4);

        return addedToHistory;
     }

     /**
     * Adds a track to the user's played history
     * 
     * @function getRecommended
     * @memberof module:services.UserService
     * @this module:services.UserService
     * @param {String} id - User id to get recommendations for
     * @returns {module:models.track} - An array of recommended tracks
     * @instance
     * @async
     */

      async getRecommended(id, user){
         if(id != user){
            throw new AuthError(2);
         }

         const currentUser = await this.user.findOne({_id: id})
                                    .populate({
                                       path: "favorite.tracks",
                                       populate: {
                                          path: "similar"
                                       }
                                    })
                                    .populate({
                                       path: "history",
                                       populate: {
                                          path: "similar"
                                       }
                                    })
                                    
         let similar = [];

         currentUser.favorite.track.forEach( (t) => {
            similar = similar.concat(t.similar)
         });

         currentUser.history.forEach( (t) => {
            similar = similar.concat(t.similar)
         });

         similar = similar.filter( e => e);
         
         for (let i = similar.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let x = similar[i];
            similar[i] = similar[j];
            similar[j] = x;
         }

         return similar.slice(0,100);
      }
 }

 module.exports = new UserService(User);