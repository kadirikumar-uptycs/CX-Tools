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
router.post('/getResources/:endpoint', isAuthenticated, controllers.getTenantResources);
router.post('/migrateResources/:endpoint', isAuthenticated, controllers.migrateTenantResources);
router.post('/authToken', isAuthenticated, controllers.getAuthToken);
router.get('/github/status', isAuthenticated, controllers.github.checkStatus);
router.get('/github/repos', isAuthenticated, controllers.github.fetchRepos);
router.post('/github/repos', isAuthenticated, controllers.github.createRepo);
router.get('/github/repos/:owner/:repoName/branches', isAuthenticated, controllers.github.fetchBranches);
router.post('/github/repos/:owner/:repoName/branches', isAuthenticated, controllers.github.createBranch);
router.post('/github/pushCode/:owner/:repoName/:branch', isAuthenticated, controllers.github.pushCode);


module.exports = router;
