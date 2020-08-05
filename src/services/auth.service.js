
const { User } = require('../models');

/**
 * Works in junction with AuthMiddlweare to perform user and request authentication operations
 * 
 * @class AuthService
 * @memberof module:services
 * @param {module:models.User} User - User Model
 */

class AuthService{
    constructor(User){
        this.user = User;
    }

    /**
     * Authenticates an user via a valid JWT token
     * 
     * @function jwtStrategy
     * @memberof module:services.AuthService
     * @this module:services.AuthService
     * @param {ObjectId} user - Id of the user as it is on the JWT Payload
     * @param {Function} next - Callback
     * @returns {module:models.user} - Authenticated user profile
     * @throws {AuthenticationError} - BadCredentials
     * @instance
     * @async
     */
    jwtStrategy(user, next){
        this.user.findById(user._id).then( (user) => {
            if(!user){
                throw new AuthenticationError(0)
            }
            
            return next(null, user);
        }).catch( (err) => {
            return next(err, false)
        });
    }

    /**
     * Authenticates an user via username/email and password
     * 
     * @function localStrategy
     * @memberof module:services.AuthService
     * @this module:services.AuthService
     * @param {String} user - Username or email of the user
     * @param {String} password - Password of the user
     * @param {Function} next - Callback
     * @returns {module:models.user} - Authenticated user profile
     * @throws {AuthenticationError} - BadCredentials
     * @throws {AuthenticationError} - NotActive
     * @instance
     * @async
     */
    localStrategy(user, password, next){
        this.user.findOne({ '$or': [ { 'username': user }, { 'email': user }  ] } ).then( (user) => {
            if(!user || !user.comparePassword(password)){
                //throw new AuthenticationError(0)
            }

            if(user.status != 1){
                //throw new AuthenticationError(1)
            }
            
            return next(null, user);
        }).catch( (err) => {
            return next(err, false)
        });
    }

    initialize(){
        
    }
}

module.exports = new AuthService(User);