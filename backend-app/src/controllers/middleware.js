let mongoDBUtils = require('../modals/mongoDB')
const decodeToken = require('./decode_token');


// middleware function for valiadting user credentials
async function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // let userInfo = { 'email': req.session.user.email };
        // let isExists = await mongoDBUtils.isUserExists(userInfo);
        if (isExists) {
            return next();
        }
    }
    return res.redirect('/login');
}


async function isValidUser(req, res, next) {
    data = await decodeToken.getDecodedOAuthJwtGoogle(req.body);
    let userData = data.payload;
    let userInfo = { 'email': userData.email };
    let isExists = await mongoDBUtils.isUserExists(userInfo);
    if (!isExists) {
        res.status(403)
        return res.send({ 'message': 'Not a valid user!!!\nPlease create account' });
    }

    // store user details in session
    req.session.user = {
        "email": userData.email,
        "name": userData.name,
        "profile": userData.picture,
    }

    next();
}



module.exports = {
    isAuthenticated,
    isValidUser,
}