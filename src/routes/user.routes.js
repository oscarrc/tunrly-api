const { Router } = require('express');
const { UserController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount UserController mehtods on.
 * @namespace UserRoutes
 * @memberof module:routes
 * @requires module:controllers.UserController
 * @requires express
 */

router.post('/',  UserController.create.bind(UserController));
router.patch('/', AuthMiddleware.authenticateJwt, UserController.update.bind(UserController));
router.get('/', AuthMiddleware.authenticateJwt, UserController.get.bind(UserController));

router.get('/check', UserController.check.bind(UserController));

module.exports = router;