const { Router } = require('express');
const { ArtistController } = require('../controllers');

const router = Router();

/**
 * Express router to mount ArtistController to handle artist related requests
 * @namespace ArtistRoutes
 * @memberof module:routes
 * @requires module:controllers.ArtistController
*/

router.get('/', ArtistController.get.bind(ArtistController));

module.exports = router;