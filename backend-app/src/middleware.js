let { isUserExists } = require('./models');

let isAuthenticated = async (req, res, next) => {
    console.log(`Checking ${req?.headers?.host} is authenticated ...`)
    if (req.session && req.session.user) {
        let userInfo = { 'email': req.session.user.email};
        let isExists = await isUserExists(userInfo);
        console.log("Valid User...");
        if (isExists) {
            return next();
        }
    }
    console.log("Invalid User");
    return res.status(401).send({'Authorized' : false});
}

module.exports = {
    isAuthenticated,
}