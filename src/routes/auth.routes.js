const { Router } = require('express');
const { AuthController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount AuthController mehtods on.
 * @namespace AuthRoutes
 * @memberof module:routes
 * @requires module:controllers.AuthController
 * @requires express
 */

router.post('/', AuthMiddleware.authenticateLocal, AuthController.login.bind(AuthController));
router.patch('/', AuthMiddleware.authenticateToken, AuthController.refresh.bind(AuthController));
router.delete('/', AuthMiddleware.deAuthenticate, AuthController.logout.bind(AuthController));

module.exports = router;