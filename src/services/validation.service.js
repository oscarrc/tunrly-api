const BaseService = require('./base.service');
// const { ApiError } = require('../errors');
const { Validation } = require('../models');

/**
 * Bussiness logic for validation system management
 * 
 * @class ValidationService
 * @extends BaseService
 * @memberof module:services
 * @param {module:repositories.ValidationRepository} ValidationRepository  - An instance of ValidationRepository
 */

class ValidationService extends BaseService{
    constructor( ValidationRepository ){
        super( ValidationRepository );
        this.validationRepository = ValidationRepository;
    }

    
    /**
     * Performs a validation action
     * 
     * @function validate
     * @memberof module:services.ValidationService
     * @this module:services.ValidationService
     * @param {String} token - An existing validation token
     * @param {Number} action - An action as defined per Validation model
     * @returns {model} - The removed validation
     * @throws {ApiError} - ValidationNotFound
     * @instance
     * @async
     */
    async validate(token, action){
        const validation = await this.validationRepository.get({ token: token, action: action});

        if( !validation ){
            // throw new ApiError(6);
        }

        validation.remove();
        
        return validation;
    }
}

module.exports = new ValidationService( Validation );