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

router.get('/', TrackController.get.bind(TrackController));
router.get('/top', CacheMiddleware, TrackController.getTop.bind(TrackController));
router.get('/lyrics', TrackController.getLyrics.bind(TrackController));
router.get('/similar', TrackController.getSimilar.bind(TrackController));
router.get('/source', TrackController.getSource.bind(TrackController));
router.get('/tag', TrackController.getByTag.bind(TrackController));


module.exports = router;