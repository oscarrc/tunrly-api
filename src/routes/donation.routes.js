const { Router } = require('express');
const { DonationController } = require('../controllers');

const router = Router();

/**
 * Express router to mount DonationController to handle donation related requests
 * @namespace DonationRoutes
 * @memberof module:routes
 * @requires module:controllers.DonationController
*/

router.post('/', DonationController.add.bind(DonationController));
router.get('/', DonationController.getMonthly.bind(DonationController));
router.get('/supporters', DonationController.getSupporters.bind(DonationController));

module.exports = router;