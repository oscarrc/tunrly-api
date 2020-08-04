//Carga de variables de entorno
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

module.exports = {
    BRAND: process.env.BRAND,
    VERSION: process.env.VERSION,
    WEB_CONCURRENCY: process.env.WEB_CONCURRENCY,
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT
};
