const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const { Schema } = mongoose;

/**
 * Artist schema.
 * 
 * Defines an artist as a Mongoose Model
 * 
 * @memberof module:models
 * @class Artist
 */
const Artist = new Schema({
    name:{
        type: String,
        required: true,
        index: true
    },
    mbid:{
        type: String
    },
    url:{
        type: String,
        required: true,
    },
    similar: [{
        type : Schema.ObjectId,
        ref: 'artist',
        autopopulate: { select: 'name image'}
    }],
    image: {
        background: [String],
        thumbnail: [String],
        logo: [String]
    },
    albums:[{
        type : Schema.ObjectId,
        ref: 'album',
        autopopulate: { select: 'name artist image'}
    }],
    tracks:[{
        type : Schema.ObjectId,
        ref: 'track',
        autopopulate: { select: 'name artist album'}
    }],
    tags: [String],
    wiki:{
        published: String,
        summary: String,
        content: String
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

Artist.plugin(autopopulate);

module.exports = mongoose.model('artist', Artist, 'artists');