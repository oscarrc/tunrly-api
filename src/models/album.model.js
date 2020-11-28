const mongoose = require('mongoose')
const { Schema } = mongoose;
const autopopulate = require('mongoose-autopopulate');

/**
 * Album schema. 
 * 
 * Defines an album as a Mongoose Model
 * 
 * @memberof module:album
 * @class Album
 */

const Album = new Schema({
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
    artist: {
        type: String,
        index: true
    },
    tracks:[{
        type : Schema.ObjectId,
        ref: 'track',
        autopopulate: { select: 'name artist album source image', maxDepth: 1}
    }],
    image: [String],
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

Album.plugin(autopopulate);

module.exports = mongoose.model('album', Album, 'albums');