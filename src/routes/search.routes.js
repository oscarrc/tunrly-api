const { Router } = require('express');
const { SearchController } = require('../controllers');

const router = Router();

/**
 * Express router to mount SearchController on
 * @namespace sessionRoutes
 * @memberof module:routes
 * @requires module:controllers.SearchController
 * @requires express
 */

router.get('/:type?', SearchController.search.bind(SearchController));

module.exports = router;