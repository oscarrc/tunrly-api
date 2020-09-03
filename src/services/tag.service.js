const { LastFmRepository } = require('../repositories');
const { ApiError } = require('../errors');

/**
 * Bussiness logic for Album management
 * 
 * @class AlbumService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.Album} Album - album model
 * @param {module:repositories.LastFmRepository} LastFM - Repo to fetch album in case it doesn't exist in the DB yet.
 */

class TagService{
    constructor(LastFM){
        this.tagRepository = LastFM;
    }

    /**
     * Gets popular tags
     * 
     * @function getTags
     * @memberof module:services.TagService
     * @this module:services.TagService
     * @param {String} page - page to fetch
     * @param {String} limit - items per page
     * @returns {Object} - An array of tag objects
     * @async
     */
    async getTags(page = 1, limit = 10){
        let tags = await this.tagRepository.getTag("getTopTags", page, limit);

        if(!tags){
            throw new ApiError(13);
        }

        return tags.toptags.tag;
    }
}

module.exports = new TagService(LastFmRepository)