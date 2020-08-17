/**
 * Defines basic functions to interface with the model and perfom basic crud operations for other services who inherit from it.
 * 
 * @class BaseService
 * @abstract
 * @param {module:models} model
 */

class BaseService{
    constructor(model){
        this.model = model;
    }

     /**
     * Creates a new document
     * 
     * @function create
     * @memberof BaseService
     * @this BaseService
     * @instance
     * @async
     * @param {Object} entity
     * @returns {(model|null)}
     */
    async create(entity){
        return await this.model.create(entity);
    }

    /**
     * Gets a document by Id
     * 
     * @function get
     * @memberof BaseService
     * @this BaseService
     * @instance
     * @async
     * @param {String} id
     * @returns {(model|null)}
     */
    async get(id, entity){
        return await this.model.findById(id);
    }

    /**
     * Updates a document by Id
     * 
     * @function update
     * @memberof BaseService
     * @this BaseService
     * @instance
     * @async
     * @param {String} id
     * @param {Object} entity
     * @returns {(model|null)}
     */
    async update(id, entity){
        return await this.model.findOneAndUpdate(id, entity, {new: true});
    }

    /**
     * Deletes a document by Id
     * 
     * @function delete
     * @memberof BaseRepository
     * @this BaseRepository
     * @instance
     * @async
     * @param {Object} query
     * @returns {Object}
     */
    async delete(id){
        return await this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseService;