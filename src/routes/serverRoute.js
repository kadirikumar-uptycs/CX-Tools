// Different API endpoints

const express = require('express');
const router = express.Router();
const {isValidUser, isAuthenticated} = require('../controllers/middleware');

const {successfullLogin, storeUserRequests, getFlagProfiles, migrateFlagProfiles} = require('../controllers/serverController');

router.post('/validateLoginUser', isValidUser, successfullLogin);
router.post('/userRequest', storeUserRequests);
router.post('/getFlagProfiles', isAuthenticated, getFlagProfiles);
router.post('/migrateFlagProfiles', isAuthenticated, migrateFlagProfiles);

module.exports = router;
