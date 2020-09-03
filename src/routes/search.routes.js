const { Router } = require('express');
const { SearchController } = require('../controllers');
const { CacheMiddleware } = require('../middlewares');

const router = Router();

/**
 * Express router to mount SearchController on
 * @namespace searchRoutes
 * @memberof module:routes
 * @requires module:controllers.SearchController
 * @requires express
 */

router.get('/', CacheMiddleware, SearchController.search.bind(SearchController));

module.exports = router;