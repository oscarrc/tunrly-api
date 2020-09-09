const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const { Schema } = mongoose;

/**
 * Track schema.
 * 
 * Defines an track as a Mongoose Model
 * 
 * @memberof module:models
 * @class Track
 */
const Track = new Schema({
    name:{
        type: String,
        required: true,
        index: true
    },
    mbid: {
        type: String
    },
    image:[String],
    duration:{
        type: Number
    },
    url:{
        type: String,
        required: true,
    },
    artist:{
        type: String,
        index: true
    },
    album:{
        name: String,
        artist: String,
        image: String
    },
    similar:[{
        type : Schema.ObjectId,
        ref: 'track',
        autopopulate: { select: 'name artist album source image'}
    }],
    source: {
        type: String
    },
    tags: [String],
    wiki:{
        published: String,
        summary: String,
        content: String
    },
    lyrics:{
        type: String
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

Track.plugin(autopopulate);

module.exports = mongoose.model('track', Track, 'tracks');