let express = require('express');
let router = express.Router();
let { isAuthenticated, isDomainAllowed, isAdmin } = require('../middleware');
let controllers = require('../controllers');


router.post('/isDomainAllowed', isAuthenticated, isDomainAllowed, (_, res) => res.status(200).send('Allowed!'))
router.get('/api', isAuthenticated, controllers.getUser)
router.post('/user', isAuthenticated, isAdmin, controllers.createUser)
router.get('/users', isAuthenticated, controllers.getUsers)
router.put('/user/:id', isAuthenticated, isAdmin, controllers.updateUser)
router.delete('/user/:id', isAuthenticated, isAdmin, controllers.deleteUser)
router.post('/getResources/:endpoint', isAuthenticated, isDomainAllowed, controllers.getTenantResources);
router.post('/migrateResources/:endpoint', isAuthenticated, isDomainAllowed, controllers.migrateTenantResources);
router.post('/authToken', isAuthenticated, controllers.getAuthToken);

module.exports = router;
