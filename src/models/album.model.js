const mongoose = require('mongoose')
const { Schema } = mongoose;

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
    url:{
        type: String,
        required: true,
    },
    artist: {
        type: String,
        index: true
    },
    tracks: [{
        name: String,
        artist: String,
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
module.exports = mongoose.model('album', Album, 'albums');