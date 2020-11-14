//Carga de variables de entorno
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

module.exports = {
    BASE_URL: process.env.BASE_URL,
    BRAND: process.env.BRAND,
    FANART_URL: process.env.FANART_URL,
    FANART_KEY: process.env.FANART_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_PASS: process.env.EMAIL_PASS,
    JWT_TTL: process.env.JWT_TTL,
    LASTFM_URL: process.env.LASTFM_URL,
    LASTFM_KEY: process.env.LASTFM_KEY,
    LASTFM_SECRET: process.env.LASTFM_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LYRICS_URL: process.env.LYRICS_URL,
    MONGO_URL: process.env.MONGO_URL,
    MUSICBRAINZ_URL: process.env.MUSICBRAINZ_URL,   
    PORT: process.env.PORT,
    PRIVATE: process.env.PRIVATE.replace(/{nl}/g, "\r\n"),
    PUBLIC: process.env.PUBLIC.replace(/{nl}/g, "\r\n"),
    REGISTRATION: process.env.REGISTRATION,
    VERSION: process.env.VERSION,  
    WEB_CONCURRENCY: process.env.WEB_CONCURRENCY,
    WEB_URL: process.env.WEB_URL
};
