let express = require('express');

let router = express.Router();
let {isAuthenticated} = require('./middleware');

let {
    storeUserRequest, 
    validateLoginUser, 
    Authenticated,
    getFlagProfiles,
    userInfo, 
    logout
} = require('./controllers');

router.post('/storeUserRequest', storeUserRequest);
router.post('/validateLoginUser', validateLoginUser);
router.post('/isAuthenticated', isAuthenticated, Authenticated);
router.get('/userInfo', userInfo);
router.post('/flagProfiles', isAuthenticated, getFlagProfiles);
router.post('/destroySession', logout);

module.exports = router;
