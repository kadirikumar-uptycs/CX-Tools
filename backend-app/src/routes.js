let express = require('express');
let router = express.Router();
let { isAuthenticated } = require('./middleware');
let {
    storeUserRequest,
    validateLoginUser,
    Authenticated,
    migrateFlagProfiles,
    getTenantResources,
    userInfo,
    logout,
} = require('./controllers');

router.post('/storeUserRequest', storeUserRequest);
router.post('/validateLoginUser', validateLoginUser);
router.post('/isAuthenticated', isAuthenticated, Authenticated);
router.get('/userInfo', userInfo);
router.post('/flagProfiles', isAuthenticated, (req, res) => getTenantResources(req, res, 'flagProfiles'));
router.post('/migrateFlagProfiles', isAuthenticated, migrateFlagProfiles);
router.post('/alertRules', isAuthenticated, (req, res) => getTenantResources(req, res, 'alertRules'));
router.post('/exceptions', isAuthenticated, (req, res) => getTenantResources(req, res, 'exceptions'));
router.post('/destroySession', logout);

module.exports = router;
