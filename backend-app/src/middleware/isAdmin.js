const User = require('../models/user');

const isAdmin = async (req, res, next) => {
    try {
        let userId = req?.user?._id;
        let requestedUserInfo = await User.findById(userId);
        if (!requestedUserInfo) {
            return res.status(401).send({ message: 'Session User not Found' });
        }
        // Check if the session user has Admin level access
        if (requestedUserInfo.role === 'Admin') {
            return next();
        } else {
            return res.status(403).send({ message: 'Restricted: Lack of Access to do the operation' });
        }
    } catch (err) {
        console.log("error while validating user access", err);
        return res.status(500).send(err);
    }
};

module.exports = isAdmin