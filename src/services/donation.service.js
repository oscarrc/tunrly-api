const BaseService = require("./base.service");
const { Donation } = require("../models");

/**
 * Bussiness logic for donation management
 * 
 * @class DonationService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.User} User - User model
 */

class DonationService extends BaseService{
     constructor(Donation){
        super(Donation);
        this.donation = Donation;
     }

     /**
     * Gets donations for the current month
     * 
     * @function getMonthlyDonations
     * @memberof module:services.DonationService
     * @this module:services.DonationService
     * @returns {Array.<module:models.donations>} - Found donations
     * @instance
     * @async
     */
     async getMonthlyDonations(){
        const date = new Date();
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth(), 31);
        const donations = await this.donation.find({"createdAt": {
            $gte: start,
            $lte: end
        }});
        return donations;
     }

      /**
     * Gets unique supporters
     * 
     * @function getSupporters
     * @memberof module:services.DonationService
     * @this module:services.DonationService
     * @returns {Array.String} - Array of supporters' names
     * @instance
     * @async
     */
     async getSupporters(){
        const supporters = await this.donation.distinct('from').map( (s) => s.from );
        return supporters;
     }
 }

 module.exports = new DonationService(Donation);