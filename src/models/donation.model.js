const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Donation schema. 
 * 
 * Defines a donetion as a Mongoose Model.
 * 
 * 
 * @memberof module:models
 * @class Donation
 * @property {String} from - Who donates
 * @property {Number} amount - How much is donated
 * @property {Number} currency - Currency of the donation
 * @property {{('Donation'|'Subscription')}} type - Donation or subscription
 * @property {Date} createdAt - Date session was created
 */
const Donation = Schema({
    from: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        index: true
    }
},{
    timestamps: true
});
    
module.exports = mongoose.model('donation', Donation, 'donations');