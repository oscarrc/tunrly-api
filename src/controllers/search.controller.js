const { AlbumService, ArtistService, TrackService, PlaylistService } = require('../services');

class SearchController{
    constructor(AlbumService){
        this.albumService = AlbumService;
        this.artistService = ArtistService;
        this.trackService = TrackService;
        this.playlistService = PlaylistService;
    }

    async search(req, res){
        const { query, page, limit } = req.query;
        const { type } = req.params;
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
                    album: await this.albumService.search(query, page, limit),
                    artist: await this.artistService.search(query, page, limit),
                    track: await this.trackService.search(query, page, limit),
                    playlist: await this.playlistService.search(query, page, limit)
                };
                break;
        }
        
        res.status(200).send(result);
    }
}

module.exports = new SearchController(AlbumService, ArtistService, TrackService, PlaylistService);