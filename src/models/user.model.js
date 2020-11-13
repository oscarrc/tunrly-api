const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const { AuthHelper } = require('../helpers');
const { compareSync, hashSync, genSaltSync } = require('bcryptjs');

/**
 * User model schema.
 * 
 * Defines an user account as a Mongoose model
 * 
 *
 * @class User
 * @memberof module:models
 * @property {String} email - Email of the user
 * @property {String} username - Username of the user. <br>Must be between 5 and 15 characters long, start and end with a letter. <br> Only (. - _) are permitted'
 * @property {String} password - User password. <br>Must be between 8 - 15 characters length and contain, at least, one upper case letter, one lower case letter, and one numeric digit
 * @property {String} firstname - User's name
 * @property {String} lastname - User's lastname or surname
 * @property {String[]} role=['user'] - Role of the user. <br>Values must be in ['user', 'editor', 'admin']
 * @property {String} country - User's country. Used to personalize some results 
 * @property {('EN'|'ES')} language='EN' - Preferred user's language. <br>Value must be in ['ES', 'EN']
 * @property {String} image - Base64 encoded user's profile image
 * @property {(0 | 1 | 2 | 3)} status=0 - Status of the user account being:
 * 
 *      0 -> Not active
 *      1 -> Active
 *      2 -> Suspended
 *      3 -> Canceled
 * 
 * @property {ObjectId[]} playlists - Array of user playlists stored as an array of user IDs. <br>Automatically populated as {@link Playlist | Playlist} when retrieved. 
 * @property {ObjectId[]} history - Array of last 100 user played songs stored as an array of user IDs. <br>Automatically populated when retrieved.
 * @property {ObjectId[]} favorite.tracks - Array of object Ids of the user favorited tracks. <br>Automatically populated when retrieved.
 * @property {ObjectId[]} favorite.albums - Array of object Ids of the user favorited albums. <br>Automatically populated when retrieved.
 * @property {ObjectId[]} favorite.artists - Array of object Ids of the user favorited artists. <br>Automatically populated when retrieved.
 * @property {ObjectId[]} favorite.playlists - Array of object Ids of the user favorited playlists. <br>Automatically populated when retrieved.
 * @property {Boolean} settings.notifications=0 - Whether or not user should receive email notifications
 * @property {Boolean} settings.personalResults=0 - Whether or not topCharts should be personalized for the user
 * @property {Boolean} settings.dark=1 - Whether or not dark theme is enabled
 * @property {Number} settings.volume=3 - Default  volume for the player
 * @property {Number} settings.quality=3 - Default  quality of the streaming
 */

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    username:{
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true,
        minlength: 5,
        match: [/^([a-z0-9]+(?:[ _.-][a-z0-9]+)*){5,15}/, 'Username must be between 5 and 15 characters long, start and end with a letter. Only (. - _) are permitted']
    },
    password:{
        type: String,
        required: true,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/, 'Password must be between 8 - 15 characters length and contain, at least, one upper case letter, one lower case letter, and one numeric digit']
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['base', 'premium', 'admin'],
        required: true,
        default: 'base'
    },
    country:{
        type: String,
    },
    language:{
        type: String,
        enum: ['en','es'],
        required: true,
        default: 'en'
    },
    image: String,
    status:{
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 3,
    },
    playlists:[{ 
        type : Schema.ObjectId,
        ref: 'playlist',
        autopopulate: true
    }],
    history:[{
        type : Schema.ObjectId,
        ref: 'track',
        autopopulate: { select: 'name artist album.name image source', depth: 2 } 
    }],
    favorite:{
        track: [{ 
            type : Schema.ObjectId,
            ref: 'track',
            autopopulate: { select: 'name artist album.name image source', depth: 2 } 
        }],
        album: [{ 
            type : Schema.ObjectId,
            ref: 'album',
            autopopulate: { select: 'name artist image', depth: 1 }
        }],
        artist: [{
            type : Schema.ObjectId,
            ref: 'artist',
            autopopulate: { select: 'name image', depth: 1 } 
        }],
        playlist: [{ 
            type : Schema.ObjectId,
            ref: 'playlist',
            autopopulate: { select: 'user.name user.image name', depth: 1} 
        }],
    },
    settings:{
        publicProfile:{
            type: Boolean,
            default: false,
            required: true
        },
        publicFavorites:{
            type: Boolean,
            default: false,
            required: true
        },
        dark:{
            type: Boolean,
            default: true,
            required: true
        },
        volume: {
            type: Number,
            min: 0,
            max: 4,
            default: 3,
            required: true
        },
        quality:{
            type: Number,
            min: 0,
            max: 4,
            default: 3,
            required: true
        }
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
},{
    timestamps: true
});

User.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.', type: 409 });
User.plugin(autopopulate);

// Hash modified password
User.pre('save', function(next){
    if(!this.isModified("password")){
        return next();
    }
   
    const salt = genSaltSync(10);
    const hashed = hashSync(this.password, salt);

    this.password = hashed;

    next();
});

// Delete user playlist before delete the user
User.pre('deleteOne', async function(next){
    const id = this.getQuery()["_id"];

    await mongoose.model('playlists').delete({'user':id});
    await mongoose.model('validation').delete({'user':id});
    await mongoose.model('session').delete({'user':id});

    next();
});

/**
 * Returns a JSON representation of the user without the password
 * 
 * @function toJSON
 * @memberof module:models.User
 * @this module:models.User
 * @returns {JSON}
 * @instance
 * @override
 */
User.methods.toJSON = function(){
    let user = this.toObject();
    delete user.password;
    return user;
}

/**
 * Compares a given string with the user password
 * 
 * @function comparePassword
 * @memberof module:models.User
 * @this module:models.User
 * @param {password} String - Password provided by the user trying to log in
 * @returns {Boolean}
 * @instance
 */
User.methods.comparePassword = function(password){
    return compareSync(password, this.password);
}

/**
 * Generates a JWT token for the user with _id, role and status as payload.
 * 
 * @function generateJwt
 * @memberof module:models.User
 * @this module:models.User
 * @instance
 * @returns {String}
 */
User.methods.generateJwt = function(){
    const payload = {
        _id: this._id,
        role: this.role,
        status: this.status 
    };

    return AuthHelper.generateToken(payload);
}

module.exports = mongoose.model('user', User, 'users');