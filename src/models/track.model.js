const mongoose = require('mongoose')
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
        artist: String
    },
    similar:[{
        name: String,
        artist: String
    }],
    source: String,
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

module.exports = mongoose.model('track', Track, 'tracks');