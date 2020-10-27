const { AlbumService, ArtistService, TrackService, PlaylistService } = require('../services');

class SearchController{
    constructor(AlbumService){
        this.albumService = AlbumService;
        this.artistService = ArtistService;
        this.trackService = TrackService;
        this.playlistService = PlaylistService;
    }

    /**
     * Search entities by the given query
     * 
     * @function search
     * @memberof module:controllers.SearchController
     * @this module:controllers.SearchController
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {String} req.query.query - Query string to search
     * @param {String} [req.query.page] - Page to fetch
     * @param {String} [req.query.limit] - Items per page
     * @returns {Object} res - Express response object
     * @instance
     * @async
     */
    async search(req, res){
        const { type, query, page, limit } = req.query;
        
        let result = {}
        
        switch(type){
            case 'album':
                result = await this.albumService.search(query, page, limit);
                break;
            case 'artist':
                result = await this.artistService.search(query, page, limit);
                break;
            case 'track':
                result = await this.trackService.search(query, page, limit);                
                break;
            case 'playlist':
                    result = await this.playlistService.search(query, page, limit);
                    break;
            default:
                result = {
                    albums: await this.albumService.search(query, page, limit),
                    artists: await this.artistService.search(query, page, limit),
                    tracks: await this.trackService.search(query, page, limit),
                    playlists: await this.playlistService.search(query, page, limit)
                };
                break;
        }
        
        res.status(200).send(result);
    }
}

module.exports = new SearchController(AlbumService, ArtistService, TrackService, PlaylistService);