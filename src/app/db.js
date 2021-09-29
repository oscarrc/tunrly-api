const mongoose = require('mongoose');

/**
 * Configures and connects to the database
 * 
 * @class Db
 * @memberof module:app
 * @param {String} uri - URI of the MogoDB database
 * @param {Object} options - An object defining Mongoose options for the connect operation
 * @requires mongoose
 */

class Db{
    constructor(uri, options){
        this.uri = uri
        this.options = options

        mongoose.set('strictPopulate', false)
    }

    /**
     * Connects to the database
     * 
     * @function connect
     * @memberof module:app.Db
     * @this module:app.Db
     * @returns {Promise} - A promise of a Mongoose conection with the database
     * @instance
     * @async
     */
    async connect(){
        return await mongoose.connect(this.uri,  this.options, () => {
            console.log(`Database connection succesfull`);
        })
    }
}

module.exports = Db;