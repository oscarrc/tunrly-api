const { Router } = require('express');
const { ValidationController } = require('../controllers');

const router = Router();

/**
 * Express router to mount ValidationController methods on
 * @namespace ValidationRoutes
 * @memberof module:routes
 * @requires module:controllers.UserController
 * @requires express
 */

router.post('/', ValidationController.create.bind(ValidationController));
router.patch('/', ValidationController.validate.bind(ValidationController));

module.exports = router;