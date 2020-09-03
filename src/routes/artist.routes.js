const { Router } = require('express');
const { ArtistController } = require('../controllers');
const { CacheMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount ArtistController to handle artist related requests
 * @namespace ArtistRoutes
 * @memberof module:routes
 * @requires module:controllers.ArtistController
*/

router.get('/', ArtistController.get.bind(ArtistController));
router.get('/top', CacheMiddleware, ArtistController.getTop.bind(ArtistController));
router.get('/albums', ArtistController.getAlbums.bind(ArtistController));
router.get('/similar', ArtistController.getSimilar.bind(ArtistController));
router.get('/tracks', ArtistController.getTracks.bind(ArtistController));

module.exports = router;