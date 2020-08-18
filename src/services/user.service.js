/**
 * Bussiness logic for user management
 * 
 * @class UserService
 * @extends BaseService
 * @memberof module:services
 * @param {module:models.User} User - User model
 */

const BaseService = require("./base.service");
const User = require("../models/user.model");

class UserService extends BaseService{
     constructor(User){
        super(User);
        this.user = User;
     }

     async findByUsernameOrEmail(value){
        const found = await this.user.findOne( { $or: [ { username: value }, { email: value }  ] } )
        
        if( !found ){
            // throw new ApiError(4);
        }

        return found;
     }

     async updatePassword(user, newPassword, oldPassword){
        if( user ){
            const validPassword = user.comparePassword(oldPassword);

            if( !validPassword ){
                throw new ApiError(5);
            }
        }

        user.password = newPassword;
        user.save();
        
        return user;
     }
 }

 module.exports = new UserService(User);