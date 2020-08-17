/**
 * Controller for session related operations. Fullfils coming from module:routes.SessionRouutes using module.services.SessionService
 * 
 * @class AuthController
 * @memberof module:controllers
 */

class AuthController {
    constructor(){
    }
    
    /**
     * Logs an user in and returns the user, a jwt token and a refresh token
     * 
     * @function login
     * @memberof module:controllers.AuthController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async login(req,res){
       const { user, token } = req.authInfo;

        return res.status(201).send({
            user: user,
            token: user.generateJwt(),
            session: token
        });
    }

    /**
     * Refreshes an user session extending its lifetime
     * 
     * @function refresh
     * @memberof module:controllers.AuthController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async refresh(req,res){
        const { user, token } = req.authInfo;

        return res.status(200).send({
            user: user,
            token: user.generateJwt(),
            session: token
        });
    }

    /**
     * Logs out an user and deletes all or given active sessions
     * 
     * @function logout
     * @memberof module:controllers.AuthController
     * @this module:controllers.AuthController
     * @param {Object} req - Express request object
     * @param {String} req.query.user - Id of the user
     * @param {String} req.query.device - The device the user is connecting from
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async logout(req,res){
        const { deleted } = req.authInfo;
        return res.status(200).send({ success: deleted });
    }
}

module.exports = new AuthController();