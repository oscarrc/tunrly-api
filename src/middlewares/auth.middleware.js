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
    passReqToCallback: true
}

const localOpt = {
    usernameField: "user",
    passwordField: "password",
    passReqToCallback: true
}

const customOpt = {
    passReqToCallback: true
}

const initialize = passport.use('jwt', new JwtStrategy(jwtOpt, AuthService.jwtStrategy.bind(AuthService)))
                           .use('local', new LocalStrategy(localOpt, AuthService.localStrategy.bind(AuthService)))
                           .use('token', new CustomStrategy(AuthService.refreshStrategy.bind(AuthService), customOpt))
                           .use('role', new CustomStrategy(AuthService.roleStrategy.bind(AuthService), customOpt))
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
    authenticateLocal: passport.authenticate('local', { session: false, failWithError: true }),
    
    /**
     * Authenticates requests based on JWT tokens
     * @function authenticateJwt
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateJwt: passport.authenticate('jwt', { session: false, failWithError: true }),

    /**
     * Authenticates an user based on refresh token
     * @function authenticateToken
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authenticateToken: passport.authenticate('token', { session: false, failWithError: true }),

    /**
     * Authorizes an user based on role
     * @function authorizeRole
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    authorizeRole: passport.authenticate('role', { session: false, failWithError: true }),

    /**
     * Logs out an user and deltes his session(s)
     * @function deAuthenticate
     * @memberof module:middlewares.AuthMiddleware
     * @returns {Undefined}
     */
    deAuthenticate: passport.authenticate('logout', { session: false, failWithError: true })
}