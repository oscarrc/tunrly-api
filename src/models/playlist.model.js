const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const { Schema } = mongoose;

/**
 * Playlist schema. 
 * 
 * Defines an playlist as a Mongoose Model
 * 
 * Contains a reference to the user who has created it.
 * 
 * @memberof module:models
 * @class Playlist
 */
const Playlist = new Schema({
    user: {
        type : Schema.ObjectId, 
        ref: 'user',
        required: true,
        index: true,
        autopopulate: { select: '-favorite -playlists -history -settings -role -language -status -email -firstname -lastname -updatedAt -__v' } 
    },
    name:{
        type: String,
        required: true,
    },
    image: String,
    description:{
        type: String
    },
    tags:[{
        type: String
    }],
    tracks: [{ 
        type : Schema.ObjectId, 
        ref: 'track',
        autopopulate: { select: 'name artist album.name image source' }
    }],
    public:{
        type: Boolean,
        default: true
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

Playlist.plugin(autopopulate);

Playlist.pre('deleteOne', async function(next){
    const playlist = this.getQuery()["_id"];
    const id = this.getQuery()["user"];

    await mongoose.model('user').updateMany({'favorite.playlists' : playlist}, { '$pull': { 'favorite.playlists' : playlist } });
    await mongoose.model('user').updateOne({'_id': id}, { '$pull': { 'playlists' : playlist } });

    next();
});

Playlist.post('save', async function(doc, next){
    const playlist = doc.get("_id");
    const id = doc.get("user");

    await mongoose.model("user").updateOne({'_id': id}, { '$addToSet': { 'playlists' : playlist } });
    
    next();
});

module.exports = mongoose.model('playlist', Playlist, 'playlists');