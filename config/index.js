//Carga de variables de entorno
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

module.exports = {
    BRAND: process.env.BRAND,
    FANART_URL: process.env.FANART_URL,
    FANART_KEY: process.env.FANART_KEY,
    GMAIL_ACCESS: process.env.GMAIL_ACCESS,
    GMAIL_CLIENT: process.env.GMAIL_CLIENT,
    GMAIL_REFRESH: process.env.GMAIL_REFRESH,
    GMAIL_SECRET: process.env.GMAIL_SECRET,
    GMAIL_USER: process.env.GMAIL_USER,
    JWT_TTL: process.env.JWT_TTL,
    LASTFM_URL: process.env.LASTFM_URL,
    LASTFM_KEY: process.env.LASTFM_KEY,
    LASTFM_SECRET: process.env.LASTFM_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    MONGO_URL: process.env.MONGO_URL,   
    PORT: process.env.PORT,
    PRIVATE: process.env.PRIVATE.replace(/{nl}/g, "\r\n"),
    PUBLIC: process.env.PUBLIC.replace(/{nl}/g, "\r\n"),
    VERSION: process.env.VERSION,  
    WEB_CONCURRENCY: process.env.WEB_CONCURRENCY,
};
