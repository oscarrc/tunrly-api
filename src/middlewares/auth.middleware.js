const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// const { AuthenticationError } = require('../errors');
const { AuthService } = require('../services');
const { PUBLIC } = require('../../config');

const jwtOpt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC,
    algorithms: ['RS256']
}

const localOpt = {
    usernameField: "user",
    passwordField: "password",
    session: false
}

passport.use(new JwtStrategy(jwtOpt, AuthService.jwtStrategy.bind(AuthService)));
passport.use(new LocalStrategy(localOpt, AuthService.localStrategy.bind(AuthService)));

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
     * Initizzlizes a passport instance. Required before start authenticating.
     * @function initialize
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    initialize: passport.initialize(),
    
    /**
     * Authenticates requests based on JWT tokens
     * @function authenticateJwt
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateJwt: passport.authenticate('jwt', { session: false, failWithError: true }),

    /**
     * Authenticates an user based on username/email and password
     * @function authenticateLocal
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateLocal: passport.authenticate('local', { session: false, failWithError: true }),
    
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
            throw new AuthenticationError(2);
        }
    
        return next();
    }
}