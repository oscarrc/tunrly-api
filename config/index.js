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
    PUBLIC: process.env.PUBLIC.replace(/{nl}/g, "\r\n")
};
