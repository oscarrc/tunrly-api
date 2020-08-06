
const { User, Session } = require('../models');

/**
 * Works in junction with AuthMiddlweare to perform user and request authentication operations
 * 
 * @class AuthService
 * @memberof module:services
 * @param {module:models.User} User - User Model
 *  @param {module:models.Session} Session - Session Model
 */

class AuthService{
    constructor(User, Session){
        this.user = User;
        this.session = Session
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
                // throw new AuthenticationError(0)
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
     * @param {Object} req - The request object
     * @param {String} user - Username or email of the user
     * @param {String} password - Password of the user
     * @param {Function} next - Callback
     * @returns {module:models.user} - Authenticated user profile
     * @throws {AuthenticationError} - BadCredentials
     * @throws {AuthenticationError} - NotActive
     * @instance
     * @async
     */
    localStrategy(req, user, password, next){
        this.user.findOne({ '$or': [ { 'username': user }, { 'email': user }  ] } ).then( (user) => {
            if(!user || !user.comparePassword(password)){
                //throw new AuthenticationError(0)
            }

            if(user.status != 1){
                //throw new AuthenticationError(1)
            }

            const session = this.session.create({ user: user._id, device: req.device })
            
            return next(null, session);
        }).catch( (err) => {
            return next(err, false)
        });
    }

    /**
     * Authenticates an user via username/email and password
     * 
     * @function refreshStrategy
     * @memberof module:services.AuthService
     * @this module:services.AuthService
     * @param {Object} req - The request object
     * @param {Function} next - Callback
     * @returns {module:models.session} - Session model to retrieve stored token
     * @throws {AuthenticationError} - BadToken
     * @throws {AuthenticationError} - NotActive
     * @instance
     * @async
     */
    refreshStrategy(req, next){
        const { token, device, user } = req.body;

        this.session.findOne({ token, device, user }).then( (session) => {
            if(!session){
                //throw new AuthenticationError(0)
            }

            if(session.user.status != 1){
                //throw new AuthenticationError(1)
            }
            
            return next(null, session);
        }).catch( (err) => {
            return next(err, false)
        });
    }

    logoutStrategy(req, next){
        const { user, device } = req.body;

        let deleted;

        if(!device){
            deleted = await this.session.deleteMany({user: user});
        }else{
            deleted = await this.session.deleteOne({ user: user, device: device});
        }

        if( deleted.deletedCount == 0 ){
            // throw new ApiError(2);
        }
        
        return next(null, { deleted: !!deleted })
    }
}

module.exports = new AuthService(User, Session);