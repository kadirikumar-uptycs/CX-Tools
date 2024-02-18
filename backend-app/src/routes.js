let express = require('express');
let router = express.Router();
let { isAuthenticated } = require('./middleware');
let {
    storeUserRequest,
    validateLoginUser,
    Authenticated,
    migrateTenantResources,
    getTenantResources,
    userInfo,
    logout,
} = require('./controllers');

router.post('/storeUserRequest', storeUserRequest);
router.post('/validateLoginUser', validateLoginUser);
router.post('/isAuthenticated', isAuthenticated, Authenticated);
router.get('/userInfo', userInfo);
router.post('/get/:endpoint', isAuthenticated, (req, res) => getTenantResources(req, res));
router.post('/migrate/:endpoint', isAuthenticated, (req, res) => migrateTenantResources(req, res));
router.post('/destroySession', logout);

module.exports = router;
