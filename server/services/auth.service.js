const {User}  = require('../models/user')

// MIDDLEWARE
const { ApiError } = require('../middleware/apiError')


const httpStatus = require('http-status')


const userService = require('./user.service')

const createUser = async(email, password) => {
    try{

        if(await User.emailTaken(email)){
            // throw new Error('Sorry email is taken')
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry email taken')
        }

        const user = new User({
            email,
            password
        })


        await user.save();
        return user;

    } catch(error){
        throw error
    }
}


const genAuthToken = async(user)=>{
    const token = user.generateAuthToken();
    return token;
}


const signInWithEmailAndPassword = async(email, password)=>{

    const user = await userService.findUserByEmail(email);

    if(!user){
        // throw new Error('Sorry BAD Email')
        throw new ApiError(httpStatus.BAD_REQUEST,'Sorry BAD email ')
    }

    if(!(await user.comparePassword(password))){
        // throw new Error('sorry BAD Password')
        throw new ApiError(httpStatus.BAD_REQUEST,'sorry BAD Password')
    }

    return user;


}


module.exports = {
    createUser,
    genAuthToken, 
    signInWithEmailAndPassword
}