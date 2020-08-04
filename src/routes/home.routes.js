const { Router } = require('express');
const { HomeController } = require('../controllers');

const router = Router();

/**
 * Express router to mount HomeController to handle requests to base URL
 * @namespace HomeRoutes
 * @memberof module:routes
 * @requires module:controllers.HomeController
*/

router.get('/', HomeController.index.bind(HomeController));

module.exports = router;