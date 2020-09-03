const { Router } = require('express');
const { TrackController } = require('../controllers');
const { CacheMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount TrackController to handle track related requests
 * @namespace TrackRoutes
 * @memberof module:routes
 * @requires module:controllers.TrackController
*/

router.get('/:id/lyrics', TrackController.getLyrics.bind(TrackController));
router.get('/:id/similar', TrackController.getSimilar.bind(TrackController));
router.get('/:id/source', TrackController.getSource.bind(TrackController));
router.get('/:name/:artist', TrackController.get.bind(TrackController));

router.get('/top', CacheMiddleware, TrackController.getTop.bind(TrackController));

module.exports = router;