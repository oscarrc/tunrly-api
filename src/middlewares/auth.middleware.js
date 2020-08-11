const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const CustomStrategy = require('passport-custom').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

// const { AuthenticationError } = require('../errors');
const { AuthService } = require('../services');
const { PUBLIC } = require('../../config');

const jwtOpt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC,
    algorithms: ['RS256'],
    passReqToCallback: true,
    failWithError: true 
}

const localOpt = {
    usernameField: "user",
    passwordField: "password",
    passReqToCallback: true,
    session: false,
    failWithError: true 
}

const customOpt = {
    passReqToCallback: true,
    failWithError: true 
}

const initialize = passport.use('jwt', new JwtStrategy(jwtOpt, AuthService.jwtStrategy.bind(AuthService)))
                           .use('local', new LocalStrategy(localOpt, AuthService.localStrategy.bind(AuthService)))
                           .use('token', new CustomStrategy(customOpt, AuthService.refreshStrategy.bind(AuthService)))
                           .use('role', new CustomStrategy(customOpt, AuthService.roleStrategy.bind(AuthService)))
                           .use('logout', new JwtStrategy(jwtOpt, AuthService.logoutStrategy.bind(AuthService)))
                           .initialize();

/**
* Collection of middlewares to handle authenticated requests and user authentication and authorization
* @namespace AuthMiddleware
* @memberof module:middlewares
* @requires passport
* @requires passport-local
* @requires passport-jwt
*/

module.exports = {
    /**
     * Initializes a passport instance. Required before start authenticating.
     * @function initialize
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    initialize: initialize,

    /**
     * Authenticates an user based on username/email and password
     * @function authenticateLocal
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateLocal: passport.authenticate('local'),
    
    /**
     * Authenticates requests based on JWT tokens
     * @function authenticateJwt
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateJwt: passport.authenticate('jwt'),

    /**
     * Authenticates an user based on refresh token
     * @function authenticateToken
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateToken: passport.authenticate('token'),

    /**
     * Authorizes an user based on role
     * @function authorizeRole
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authorizeRole: passport.authenticate('role'),

    /**
     * Logs out an user and deltes his session(s)
     * @function deAuthenticate
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    deAuthenticate: passport.authenticate('logout'),
    
    /**
     * Authorizes users based on roles
     * @function authorize
     * @memberof module:middlewares.AuthMiddleware
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @throws {AuthenticationError} - InsufficientPermits
     * @returns {Function}
     */
    authorize: (...roles) => async (req,res,next) => {
        const hasRole = roles.some(role => req.user.role.indexOf(role) != -1);
        
        if(!hasRole){
            // throw new AuthenticationError(2);
        }
    
        return next();
    }
}