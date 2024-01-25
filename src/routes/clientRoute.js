// Routes for different views for the user
const {isAuthenticated} = require('../controllers/middleware');
const express = require('express');
const router = express.Router();

const {homePage, loginPage, migrateFlagProfiles, usersPage, compareFlagProfiles} = require('../controllers/clientController');

router.get('/login', loginPage);
router.get('/', isAuthenticated, homePage);
router.get('/migrate-flag-profiles', isAuthenticated, migrateFlagProfiles);
router.get('/users', isAuthenticated, usersPage);
router.get('/compare-flag-profiles', isAuthenticated, compareFlagProfiles);

module.exports = router;
