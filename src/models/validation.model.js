const autopopulate = require('mongoose-autopopulate');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

/**
 * Validation schema. 
 * 
 * Defines a validation as a Mongoose Model.
 * 
 * A validation is a token and action tied to an user used to validate certain API actions.
 * 
 * @memberof module:models
 * @class Validation
 * @property {ObjectId} User - Id of the user validation was created for
 * @property {String} token - Token needed to perfom the validation
 * @property {(0|1)} action - Action this validation was created for
 * 
 *      0 -> Validate email
 *      1 -> Change password
 * 
 * @property {Date} createdAt - Date session was created
 * @property {Date} updatedAt - Date session was updated: <br>It will expire after 12 hours
 */
const Validation = Schema({
    user: {
      type: Schema.ObjectId,
      required: true,
      ref: 'user',
      index: true,
      autopopulate: true
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: Number,
      required: true,
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        expires: '3600' //12 horas
    }
},{
    timestamps: true
});

Validation.plugin(autopopulate);

Validation.pre('validate', function(next){
  this.token = this.user + crypto.randomBytes(16).toString('hex');
  next();
})
    
module.exports = mongoose.model('validation', Validation, 'validations');