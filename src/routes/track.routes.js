const { Router } = require('express');
const { TrackController } = require('../controllers');

const router = Router();

/**
 * Express router to mount TrackController to handle track related requests
 * @namespace TrackRoutes
 * @memberof module:routes
 * @requires module:controllers.TrackController
*/

router.get('/', TrackController.get.bind(TrackController));

module.exports = router;