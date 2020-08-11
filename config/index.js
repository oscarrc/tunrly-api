//Carga de variables de entorno
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

module.exports = {
    BRAND: process.env.BRAND,
    VERSION: process.env.VERSION,
    WEB_CONCURRENCY: process.env.WEB_CONCURRENCY,   
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_TTL: process.env.JWT_TTL,
    PRIVATE: process.env.PRIVATE.replace(/{nl}/g, "\r\n"),
    PUBLIC: process.env.PUBLIC.replace(/{nl}/g, "\r\n"),
    LASTFM_URL: process.env.LASTFM_URL,
    LASTFM_KEY: process.env.LASTFM_KEY,
    LASTFM_SECRET: process.env.LASTFM_SECRET
};
