let express = require('express');
let router = express.Router();
let { isAuthenticated, isDomainAllowed } = require('./middleware');
let {
    storeUserRequest,
    validateLoginUser,
    migrateTenantResources,
    getTenantResources,
    userInfo,
    addUser,
    getZohoTickets,
    zohoToTotango,
    getUsersDetails,
    logout,
} = require('./controllers');

router.post('/storeUserRequest', storeUserRequest);
router.post('/validateLoginUser', validateLoginUser);
router.get('/isAuthenticated', isAuthenticated, (req, res) => {
    return res.status(200).send({'Authorized': true});
});
router.get('/userInfo', isAuthenticated, userInfo);
router.post('/get/:endpoint', isAuthenticated, isDomainAllowed, (req, res) => getTenantResources(req, res));
router.post('/migrate/:endpoint', isAuthenticated, isDomainAllowed, (req, res) => migrateTenantResources(req, res));
router.post('/zohoTickets', isAuthenticated, (req, res) => getZohoTickets(req, res));
router.post('/migrateToTotango', isAuthenticated, (req, res) => zohoToTotango(req, res));
router.post('/addUser', isAuthenticated, (req, res) => addUser(req, res));
router.get('/users', isAuthenticated, getUsersDetails)
router.post('/destroySession', logout);

module.exports = router;
