const autopopulate = require('mongoose-autopopulate');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

/**
 * Session schema. 
 * Defines a session as a Mongoose Model.
 * 
 * Session is a long lived token tied to an user and device.
 * 
 * @memberof module:models
 * @class Session
 * @property {ObjectId} user - Id of the user owning this session.<br>Automatically populated when retrieved
 * @property {String}  device - Unique id of the device of this session
 * @property {Strint} token - Token used to renew the session
 * @property {Date} createdAt - Date session was created
 * @property {Date} updatedAt - Date session was updated: <br>It will expire after 365 days
 */

const Session = Schema({
    user: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        ref: 'user',
        autopopulate: true
    },
    device: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        expires: '365d' //1 año
    }
},{
    timestamps: true
});

Session.plugin(autopopulate);

// Create the session token before save
Session.pre('save', function(next){
    this.token = this.user._id + crypto.randomBytes(16).toString('hex');
    next();
});

// Recreate the token before update
Session.pre('findOneAndUpdate', function(next){
    this._update.$set.token = this._update.user + crypto.randomBytes(16).toString('hex');
    next();
});

module.exports = mongoose.model('session', Session, 'sessions');