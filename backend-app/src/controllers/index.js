const getUsers = require('./getUsers');
const getUser = require('./getUser');
const createUser = require('./createUser');
const updateUser = require('./updateUser');
const deleteUser = require('./deleteUser');
const getTenantResources = require('./getTenantResources');
const migrateTenantResources = require('./migrateTenantResources');
const getAuthToken = require('./getAuthToken');

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getTenantResources,
    migrateTenantResources,
    getAuthToken
}