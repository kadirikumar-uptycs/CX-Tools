let { isUserExists } = require('./models');

let isAuthenticated = async (req, res, next) => {
    if (req.session && req.session.user) {
        let userInfo = { 'email': req.session.user.email};
        let isExists = await isUserExists(userInfo);
        if (isExists) {
            return next();
        }
    }
    return res.status(401).send({'Authorized' : false});
}

module.exports = {
    isAuthenticated,
}