const { Router } = require('express');
const { UserController } = require('../controllers');
const { AuthMiddleware, CacheMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount UserController mehtods on.
 * @namespace UserRoutes
 * @memberof module:routes
 * @requires module:controllers.UserController
 * @requires express
 */

router.get('/check', UserController.check.bind(UserController));
router.get('/recommendations/:id', AuthMiddleware.authenticateJwt, CacheMiddleware, UserController.getRecommended.bind(UserController));

router.post('/',  UserController.create.bind(UserController));
router.put('/', AuthMiddleware.authenticateJwt, UserController.update.bind(UserController));
router.get('/:username?', AuthMiddleware.authenticateJwt, UserController.get.bind(UserController));

router.patch('/profile/password', AuthMiddleware.authenticateJwt, UserController.updatePassword.bind(UserController));
router.patch('/profile/favorites', AuthMiddleware.authenticateJwt, UserController.setFavorite.bind(UserController));
router.patch('/profile/history',  AuthMiddleware.authenticateJwt, UserController.addToHistory.bind(UserController));

module.exports = router;