const { Router } = require('express');
const { TagController } = require('../controllers');
const { CacheMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount TagController on
 * @namespace searchRoutes
 * @memberof module:routes
 * @requires module:controllers.TagController
 * @requires express
 */

router.get('/', CacheMiddleware, TagController.getTags.bind(TagController));
router.get('/:tag', CacheMiddleware, TagController.getByTag.bind(TagController));

module.exports = router;