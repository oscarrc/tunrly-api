const { AlbumService, ArtistService, TrackService, PlaylistService, TagService } = require('../services');

class TagController{
    constructor(AlbumService){
        this.albumService = AlbumService;
        this.artistService = ArtistService;
        this.trackService = TrackService;
        this.playlistService = PlaylistService;
        this.tagService = TagService
    }

    async getTags(req,res){
        const { page, limit } = req.query;
        const tags = await this.tagService.getTags(page,limit);

        return res.status(200).send(tags);
    }

    /**
     * Gets popular entities by tag
     * 
     * @function getByTag
     * @memberof module:controllers.TagController
     * @this module:controllers.TagController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.params.tag - Tag to search
     * @param {String} [req.query.page ]- Page to fetch
     * @param {String} [req.query.limit]- Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async getByTag(req, res){
        const { type, page, limit } = req.query;
        const { tag } = req.params;
        let result = {}
        
        switch(type){
            case 'album':
                result = await this.albumService.getByTag(tag, page, limit);
                break;
            case 'artist':
                result = await this.artistService.getByTag(tag, page, limit);
                break;
            case 'track':
                result = await this.trackService.getByTag(tag, page, limit);
                break;
            case 'playlist':
                    result = await this.playlistService.getByTag(tag, page, nlimitalimitme);
                    break;
            default:
                result = {
                    album: await this.albumService.getByTag(tag, page, limit),
                    artist: await this.artistService.getByTag(tag, page, limit),
                    track: await this.trackService.getByTag(tag, page, limit),
                    playlist: await this.playlistService.getByTag(tag, page, limit)
                };
                break;
        }
        
        res.status(200).send(result);
    }
}

module.exports = new TagController(AlbumService, ArtistService, TrackService, PlaylistService, TagService);