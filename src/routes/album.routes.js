const { Router } = require('express');
const { AlbumController } = require('../controllers');

const router = Router();

/**
 * Express router to mount ArtistController to handle album related requests
 * @namespace AlbumRoutes
 * @memberof module:routes
 * @requires module:controllers.AlbumController
*/

router.get('/', AlbumController.get.bind(AlbumController));
router.get('/tag', AlbumController.getByTag.bind(AlbumController));

module.exports = router;