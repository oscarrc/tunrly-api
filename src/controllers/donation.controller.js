const { DonationService } = require('../services');

/**
 * Controller for donation related operations
 * 
 * @class DonationController
 * @memberof module:controllers
 * @param {module:repositories.DonationService} DonationService  - An instance of DonationService
 */

class DonationController{
    constructor(DonationService){
        this.donationService = DonationService;
    }

    /**
     * Adds a donation
     * 
     * @function add
     * @memberof module:controllers.DonationController
     * @this module:controllers.DonationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async add(req,res){
        const donation = JSON.parse(req.body.data);
        
        const added = await this.donationService.create({
            from: donation.from_name,
            amount: donation.amount,
            currency: donation.currency,
            type: donation.type
        })

        return res.sendStatus(!!added ? 200 : 401);
    }

     /**
     * Gets donations for the current month
     * 
     * @function getMonthly
     * @memberof module:controllers.DonationController
     * @this module:controllers.DonationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getMonthly(req,res){
        let donations = await this.donationService.getMonthlyDonations()
        return res.status(200).send(donations);
    }

    /**
     * Gets unique supporters
     * 
     * @function getSupporters
     * @memberof module:controllers.DonationController
     * @this module:controllers.DonationController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getSupporters(req,res){
        let suporters = await this.donationService.getSupporters()
        return res.status(200).send(suporters);
    }
}

module.exports = new DonationController(DonationService);