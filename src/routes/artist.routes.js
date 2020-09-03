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

router.get('/:name', ArtistController.get.bind(ArtistController));
router.get('/:id/albums', ArtistController.getAlbums.bind(ArtistController));
router.get('/:id/similar', ArtistController.getSimilar.bind(ArtistController));
router.get('/:id/tracks', ArtistController.getTracks.bind(ArtistController));

router.get('/top', CacheMiddleware, ArtistController.getTop.bind(ArtistController));

module.exports = router;