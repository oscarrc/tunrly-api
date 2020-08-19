
const { User, Session } = require('../models');
const { AuthError } = require('../errors');

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
    jwtStrategy(req, user, next){
        this.user.findById(user._id).then( (user) => {
            if(!user){
                throw new AuthError(0);
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
        this.user.findOne( { '$or': [ { 'username': user }, { 'email': user }  ] } ).then( (user) => {
            const { device } = req.body;
            
            if(!user || !user.comparePassword(password)){
                throw new AuthError(0)
            }

            if(user.status != 1){
                throw new AuthError(1)
            }
            
            return this.session.findOneAndUpdate({ user: user._id, device: device }, { user: user._id, device: device }, {upsert: true, new: true, setDefaultsOnInsert: true})
        }).then( (session) => {
            const user = session.user;
            return next(null, user, session);
        }).catch( (err) => {
            return next(err, false);
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
        
        this.session.findOneAndUpdate({ token, device, user }, { device, user }, { new: true }).then( (session) => {
            if(!session){
                throw new AuthError(0)
            }

            if(session.user.status != 1){
                throw new AuthError(1)
            }
            
            const user = session.user;
            
            return next(null, user, session);
        }).catch( (err) => {
            return next(err, false)
        });
    }

    /**
     * De-authenticates an user session(s)
     * 
     * @function logoutStrategy
     * @memberof module:services.AuthService
     * @this module:services.AuthService
     * @param {Object} req - The request object
     * @param {Function} next - Callback
     * @returns {Boolean} - Wheter the session has been deleted or not
     * @throws {AuthenticationError} - BadToken
     * @throws {AuthenticationError} - NotActive
     * @instance
     * @async
     */
    logoutStrategy(req, user, next){
        const { device } = req.body;
        const toDelete = device ? { user: user._id, device: device } : { user: user._id };
        
        this.session.deleteMany(toDelete).then( deleted => {
            if( deleted.deletedCount == 0 ){
                throw new AuthError(2);
            }
            
            return next(null, user, {deleted: !!deleted })
        }).catch( (err) => {
            return next(err, false)
        });
    }

    /**
     * Authorizes an user based on roles
     * 
     * @function roleStrategy
     * @memberof module:services.AuthService
     * @this module:services.AuthService
     * @param {Object} req - The request object
     * @param {Function} next - Callback
     * @returns { null } - Next middleware
     * @throws {AuthenticationError} - Unauthorized
     * @instance
     * @async
     */
    roleStrategy(req, next){
        const hasRole = roles.some(role => req.user.role == role);
        
        if(!hasRole){
            throw new AuthError(3);
        }
    
        return next();

    }
}

module.exports = new AuthService(User, Session);