const { Router } = require('express');
const { PlaylistController } = require('../controllers');

const router = Router();

/**
 * Express router to mount PlaylistController to handle playlist related requests
 * @namespace PlaylistRoutes
 * @memberof module:routes
 * @requires module:controllers.PlaylistController
*/

router.get('/', PlaylistController.get.bind(PlaylistController));
router.post('/', PlaylistController.create.bind(PlaylistController));
router.put('/', PlaylistController.update.bind(PlaylistController));
router.delete('/', PlaylistController.delete.bind(PlaylistController));

router.get('/user', PlaylistController.getUserPlaylists.bind(PlaylistController));

router.patch('/add', PlaylistController.addToPlaylist.bind(PlaylistController));
router.patch('/remove', PlaylistController.removeFromPlaylist.bind(PlaylistController));

module.exports = router;