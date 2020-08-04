const { BRAND, VERSION } = require('../../config');

class HomeService{
    constructor(brand, version){
        this.version = version
        this.brand = brand
    }

    index(){
        return {
            message: `${this.brand} REST API v.${this.version}`
        }
    }
}

module.exports = new HomeService(BRAND, VERSION);