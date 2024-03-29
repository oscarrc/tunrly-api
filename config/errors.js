module.exports = {
    ApiError: [
        {
            status: 500,
            name: "SessionCreationError",
            message: "Unable to create a session"
        },
        {
            status: 400,
            name: "SessionNotFound",
            message: "Session does not exists or it has expired"
        },
        {
            status: 400,
            name: "SessionDeletionError",
            message: "Unable to delete this session. Does it exits?"
        },
        {
            status: 500,
            name: "SessionDeletionError",
            message: "Unable to delete a session"
        },
        {
            status: 404,
            name: "UserNotFound",
            message: "Requested user does not exists"
        },
        {
            status: 400,
            name: "BadPassword",
            message: "Must provide a valid password"
        },
        {
            status: 400,
            name: "ValidationNotFound",
            message: "Validation token does not exists or it has expired"
        },
        {
            status: 404,
            name: "AlbumNotFound",
            message: "Album not found"
        },
        {
            status: 404,
            name: "ArtistNotFound",
            message: "Artist not found"
        },
        {
            status: 404,
            name: "TrackNotFound",
            message: "Track not found"
        },
        {
            status: 500,
            name: "UnableToCreatePlaylist",
            message: "Unable to create the playlist"
        },
        {
            status: 500,
            name: "UnableToDeletePlaylist",
            message: "Unable to delete the playlist"
        },
        {
            status: 404,
            name: "PlaylistNotFound",
            message: "The playlist was not found or it doesn't belong to you"
        },
        {
            status: 500,
            name: "UnableToFetchTags",
            message: "We're unable to fetch tags. Try again later."
        }
    ],
    AuthError: [
        {
            status: 401,
            name: "BadCredentials",
            message: "Bad credentials"
        },
        {
            status: 403,
            name: "NotActive",
            message: "Account is not active"
        }, 
        {
            status: 403,
            name: "InsufficientPermits",
            message: "Insufficient permits"
        },
        {
            status: 401,
            name: "SessionExpired",
            message: "Session has expired or is not valid"
        }              
    ]
}